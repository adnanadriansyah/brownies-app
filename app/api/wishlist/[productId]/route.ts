import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const auth = await requireAuth()
  if (auth.error) return auth.error

  const { productId } = await params
  const userId = auth.session!.user.id

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
  })
  if (!existing) {
    return NextResponse.json({ error: 'Not found in wishlist' }, { status: 404 })
  }

  await prisma.wishlist.delete({
    where: { userId_productId: { userId, productId } },
  })

  return NextResponse.json({ message: 'Removed from wishlist' })
}
