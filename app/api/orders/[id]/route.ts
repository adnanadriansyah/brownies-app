import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  paymentStatus: z.enum(['UNPAID', 'PAID', 'REFUNDED']).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: { include: { product: true } },
    },
  })
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const userId = auth.session!.user.id
  const isAdmin = auth.session!.user.role === 'ADMIN'
  if (order.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(order)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const userId = auth.session!.user.id
  const isAdmin = auth.session!.user.role === 'ADMIN'

  try {
    const body = await req.json()
    const data = statusSchema.parse(body)

    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (!isAdmin) {
      if (order.userId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      if (data.status !== 'CANCELLED' || order.status !== 'PENDING') {
        return NextResponse.json({ error: 'Hanya dapat membatalkan pesanan dengan status PENDING' }, { status: 403 })
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (data.status === 'CANCELLED' && order.status !== 'CANCELLED') {
        const items = await tx.orderItem.findMany({ where: { orderId: id } })
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }
      }
      return tx.order.update({ where: { id }, data })
    })
    return NextResponse.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
