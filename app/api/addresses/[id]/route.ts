import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  label: z.string().min(1).optional(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  province: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
})

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const userId = auth.session!.user.id

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }
  if (existing.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.update({ where: { id }, data })
    return NextResponse.json(address)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const userId = auth.session!.user.id

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Address not found' }, { status: 404 })
  }
  if (existing.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.address.delete({ where: { id } })
  return NextResponse.json({ message: 'Address deleted' })
}
