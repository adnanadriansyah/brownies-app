import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const category = await prisma.category.create({ data })
    return NextResponse.json(category, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
