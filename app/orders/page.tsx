'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatRupiah, formatDate } from '@/lib/utils'
import { AnimatedSection, StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: { id: string; name: string }
}

interface Order {
  id: string
  status: string
  totalAmount: number
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Pending', style: 'bg-[rgba(196,122,138,0.2)] text-text-rose border-[rgba(196,122,138,0.3)]' },
  PROCESSING: { label: 'Diproses', style: 'bg-[rgba(239,159,39,0.15)] text-warning border-[rgba(239,159,39,0.3)]' },
  SHIPPED: { label: 'Dikirim', style: 'bg-[rgba(55,138,221,0.15)] text-info border-[rgba(55,138,221,0.3)]' },
  DELIVERED: { label: 'Selesai', style: 'bg-[rgba(63,122,50,0.2)] text-success border-[rgba(63,122,50,0.3)]' },
  CANCELLED: { label: 'Dibatalkan', style: 'bg-[rgba(226,75,74,0.15)] text-danger border-[rgba(226,75,74,0.3)]' },
}

export default function OrdersPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetch('/api/orders').then((r) => r.json()).then(setOrders).catch(() => {})
  }, [session, router])

  if (!session) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <AnimatedSection>
        <h1 className="font-heading text-text-heading text-2xl mb-1">Riwayat Pesanan</h1>
        <p className="text-[11px] text-text-muted mb-8">{orders.length} pesanan</p>
      </AnimatedSection>

      {orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <p className="text-text-muted mb-4">Belum ada pesanan</p>
          <Link href="/products"><Button variant="outline">Mulai Belanja</Button></Link>
        </motion.div>
      ) : (
        <div className="space-y-0">
          {orders.map((order, i) => {
            const cfg = statusConfig[order.status] || statusConfig.PENDING
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="py-5 border-b-[0.5px] border-white/10 group hover:bg-white/[0.01] transition-colors duration-200 -mx-4 px-4 rounded-[2px]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[12px] text-rose font-mono font-bold tracking-wider">
                      #ORD-{order.id.slice(0, 6).toUpperCase()}
                    </span>
                    <span className="text-[10px] text-text-muted">{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={`text-[8px] uppercase tracking-[2px] px-2.5 py-1 rounded-[1px] border-[0.5px] ${cfg.style}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-[11px] text-text-body truncate mb-2">
                  {order.items.map((i) => i.product.name).join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-text-rose text-[14px] font-medium">{formatRupiah(order.totalAmount)}</span>
                  <Link href={`/orders/${order.id}`}>
                    <motion.span
                      whileHover={{ x: 2 }}
                      className="text-[9px] uppercase tracking-[2px] text-rose border-[0.5px] border-rose px-3 py-1.5 rounded-[2px] hover:bg-rose/10 transition-all duration-200 inline-block"
                    >
                      Lihat Detail &rarr;
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
