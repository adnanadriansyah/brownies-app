import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { z } from 'zod'

const schema = z.object({
  paymentProof: z.string().min(1, 'Nomor referensi transfer wajib diisi'),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const userId = auth.session!.user.id

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) {
    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 })
  }
  if (order.userId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  if (order.paymentStatus !== 'UNPAID') {
    return NextResponse.json({ error: 'Pembayaran sudah diproses' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { paymentProof } = schema.parse(body)

    const updated = await prisma.order.update({
      where: { id },
      data: {
        paymentProof,
        paymentStatus: 'PAID',
        paidAt: new Date(),
      },
    })

    return NextResponse.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 422 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
