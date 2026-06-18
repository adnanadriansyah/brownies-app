import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await requireAdmin()
  if (admin.error) return admin.error

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true, reviews: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}
