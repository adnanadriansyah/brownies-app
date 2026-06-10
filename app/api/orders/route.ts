import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth, requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const createSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: z.string().min(1),
  paymentMethod: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id
  const isAdmin = auth.session!.user.role === 'ADMIN'
  const { searchParams } = req.nextUrl

  if (isAdmin && searchParams.get('all') === 'true') {
    const status = searchParams.get('status')
    const where: any = {}
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { product: { select: { id: true, name: true, price: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: { include: { product: { select: { id: true, name: true, price: true, imageUrl: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id

  try {
    const body = await req.json()
    const { items, shippingAddress, paymentMethod } = createSchema.parse(body)

    const productIds = items.map(i => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
    const productMap = new Map(products.map(p => [p.id, p]))

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 })
      }
    }

    const totalAmount = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!
      return sum + product.price * item.quantity
    }, 0)

    const order = await prisma.$transaction(async (tx) => {
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return tx.order.create({
        data: {
          userId,
          totalAmount,
          shippingAddress,
          paymentMethod,
          items: {
            create: items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: {
          items: { include: { product: { select: { id: true, name: true, price: true } } } },
        },
      })
    })

    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
