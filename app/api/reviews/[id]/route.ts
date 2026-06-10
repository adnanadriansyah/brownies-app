import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { id } = await params
  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 })
  }

  const userId = auth.session!.user.id
  const isAdmin = auth.session!.user.role === 'ADMIN'
  if (review.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.review.delete({ where: { id } })
  return NextResponse.json({ message: 'Review deleted' })
}
