import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  label: z.string().min(1),
  street: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().default(false),
})

export async function GET() {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
  })
  return NextResponse.json(addresses)
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const userId = auth.session!.user.id

  try {
    const body = await req.json()
    const data = schema.parse(body)

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({ data: { ...data, userId } })
    return NextResponse.json(address, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
