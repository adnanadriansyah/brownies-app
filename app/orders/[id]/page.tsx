'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatRupiah, formatDate } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: { id: string; name: string; imageUrl: string | null; price: number }
}

interface Order {
  id: string
  status: string
  totalAmount: number
  shippingAddress: string
  paymentMethod: string
  paymentStatus: string
  createdAt: string
  user: { id: string; name: string; email: string }
  items: OrderItem[]
}

const statusConfig: Record<string, { label: string; style: string }> = {
  PENDING: { label: 'Pending', style: 'bg-[rgba(196,122,138,0.2)] text-text-rose border-[rgba(196,122,138,0.3)]' },
  PROCESSING: { label: 'Diproses', style: 'bg-[rgba(239,159,39,0.15)] text-warning border-[rgba(239,159,39,0.3)]' },
  SHIPPED: { label: 'Dikirim', style: 'bg-[rgba(55,138,221,0.15)] text-info border-[rgba(55,138,221,0.3)]' },
  DELIVERED: { label: 'Selesai', style: 'bg-[rgba(63,122,50,0.2)] text-success border-[rgba(63,122,50,0.3)]' },
  CANCELLED: { label: 'Dibatalkan', style: 'bg-[rgba(226,75,74,0.15)] text-danger border-[rgba(226,75,74,0.3)]' },
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const addItem = useCart((s) => s.addItem)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetch(`/api/orders/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Not found'); return r.json() })
      .then((data) => { setOrder(data); setLoading(false) })
      .catch(() => { setLoading(false); router.push('/orders') })
  }, [id, session, router])

  async function updateStatus(status: string) {
    setUpdating(true)
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrder((prev) => prev ? { ...prev, status: updated.status } : prev)
    }
    setUpdating(false)
  }

  if (loading || !session) {
    return <div className="p-8 text-center text-text-muted">
      <div className="shimmer h-8 w-48 mx-auto mb-4" />
      <div className="shimmer h-4 w-64 mx-auto" />
    </div>
  }

  if (!order) return null

  const cfg = statusConfig[order.status] || statusConfig.PENDING

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button
        whileHover={{ x: -3 }}
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[10px] uppercase tracking-[1.5px] text-text-muted hover:text-text-rose transition-colors mb-6"
      >
        <ChevronLeft size={12} /> Kembali
      </motion.button>

      <AnimatedSection>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-text-heading text-2xl flex items-center gap-3">
              #ORD-{order.id.slice(0, 6).toUpperCase()}
            </h1>
            <p className="text-[11px] text-text-muted mt-1">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-[9px] uppercase tracking-[2px] px-3 py-1.5 rounded-[1px] border-[0.5px] ${cfg.style}`}>
            {cfg.label}
          </span>
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { label: 'Alamat Pengiriman', value: order.shippingAddress },
          { label: 'Pembayaran', value: `${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)} — ${order.paymentStatus}` },
        ].map((info, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="bg-bg-section p-4 rounded-[4px] border-[0.5px] border-white/10"
          >
            <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-2">{info.label}</h3>
            <p className="text-[12px] text-text-body">{info.value}</p>
          </motion.div>
        ))}
      </div>

      <AnimatedSection delay={0.2}>
        <div className="space-y-3 mb-6">
          {order.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 py-3 border-b-[0.5px] border-white/10 group"
            >
              <div className="relative w-14 h-14 shrink-0 bg-bg-card overflow-hidden rounded-[2px]">
                {item.product.imageUrl ? (
                  <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[9px] text-text-muted">No Img</div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[13px] text-text-heading">{item.product.name}</p>
                <p className="text-[10px] text-text-muted">{item.quantity} &times; {formatRupiah(item.price)}</p>
              </div>
              <p className="text-[13px] text-text-rose font-medium">{formatRupiah(item.price * item.quantity)}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>

      <div className="flex justify-between items-center mb-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => {
            order.items.forEach((i) => addItem(
              { productId: i.product.id, name: i.product.name, price: i.product.price, imageUrl: i.product.imageUrl, stock: 999 },
              i.quantity,
            ))
            router.push('/cart')
          }}>
            <ShoppingBag size={12} /> Beli Lagi
          </Button>
        </motion.div>
        <p className="text-text-rose text-[22px] font-heading">
          Total: <span className="font-semibold">{formatRupiah(order.totalAmount)}</span>
        </p>
      </div>

      {session?.user?.role === 'ADMIN' && (
        <AnimatedSection>
          <div className="bg-bg-section p-4 rounded-[4px] border-[0.5px] border-white/10">
            <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-3">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                <motion.button
                  key={s}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={updating || order.status === s}
                  onClick={() => updateStatus(s)}
                  className={`text-[9px] uppercase tracking-[1.5px] px-3 py-1.5 rounded-[2px] transition-all duration-200 ${
                    order.status === s
                   ? 'bg-rose text-white'
                  : 'border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-rose/50'
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}
