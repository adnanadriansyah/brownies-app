import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
    },
  })
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  const { id } = await params
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    })
    return NextResponse.json(product)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ message: 'Product deleted' })
}
