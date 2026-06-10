import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  })
  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  return NextResponse.json(category)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  const { id } = await params
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const category = await prisma.category.update({ where: { id }, data })
    return NextResponse.json(category)
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
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ message: 'Category deleted' })
}
