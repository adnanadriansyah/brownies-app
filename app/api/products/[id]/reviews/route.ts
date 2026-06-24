import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reviews = await prisma.review.findMany({
    where: { productId: id },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(reviews)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const userId = auth.session!.user.id

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const review = await prisma.review.create({
      data: { ...data, userId, productId: id },
      include: { user: { select: { id: true, name: true } } },
    })

    const agg = await prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: true,
    })
    await prisma.product.update({
      where: { id },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
