import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0).default(0),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const active = searchParams.get('active')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: any = {}
  if (category) where.categoryId = category
  if (search) where.name = { contains: search, mode: 'insensitive' }
  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }
  if (active === 'true') where.isActive = true
  if (active === 'false') where.isActive = false

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const product = await prisma.product.create({ data, include: { category: true } })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
