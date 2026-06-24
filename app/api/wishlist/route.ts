import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id
  const { productId } = await req.json()

  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 })
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  if (existing) {
    return NextResponse.json({ message: 'Already in wishlist' })
  }

  const item = await prisma.wishlist.create({
    data: { userId, productId },
    include: {
      product: {
        include: {
          category: { select: { id: true, name: true } },
        },
      },
    },
  })

  return NextResponse.json(item, { status: 201 })
}
