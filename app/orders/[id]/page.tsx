'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { ChevronLeft, ShoppingBag, Printer, Copy, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatRupiah, formatDate } from '@/lib/utils'
import { bankAccounts } from '@/lib/payment'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/Toast/Toast'
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
  paymentProof: string | null
  paidAt: string | null
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
  const toast = useToast((s) => s.addToast)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [paymentProof, setPaymentProof] = useState('')
  const [confirmingPayment, setConfirmingPayment] = useState(false)

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetch(`/api/orders/${id}`)
      .then((r) => { if (!r.ok) throw new Error('Not found'); return r.json() })
      .then((data) => { setOrder(data); setLoading(false) })
      .catch(() => { setLoading(false); router.push('/orders') })
  }, [id, session, router])

  async function updateStatus(status: string, paymentStatus?: string) {
    setUpdating(true)
    const body: Record<string, string> = { status }
    if (paymentStatus) body.paymentStatus = paymentStatus
    const res = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrder((prev) => prev ? { ...prev, status: updated.status, paymentStatus: updated.paymentStatus } : prev)
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
          {order.status === 'PENDING' && session?.user?.id === order.user.id && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={updating}
              onClick={async () => {
                if (!confirm('Yakin ingin membatalkan pesanan ini?')) return
                setUpdating(true)
                const res = await fetch(`/api/orders/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'CANCELLED' }),
                })
                if (res.ok) {
                  const updated = await res.json()
                  setOrder((prev) => prev ? { ...prev, status: updated.status } : prev)
                }
                setUpdating(false)
              }}
              className="text-[9px] uppercase tracking-[2px] text-danger border-[0.5px] border-danger/40 px-3 py-1.5 rounded-[2px] hover:bg-danger/10 transition-all duration-200"
            >
              {updating ? '...' : 'Batalkan Pesanan'}
            </motion.button>
          )}
        </div>
      </AnimatedSection>

      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-bg-section p-4 rounded-[4px] border-[0.5px] border-white/10"
        >
          <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-2">Alamat Pengiriman</h3>
          <p className="text-[12px] text-text-body">{order.shippingAddress}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-bg-section p-4 rounded-[4px] border-[0.5px] border-white/10"
        >
          <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-2">Pembayaran</h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[12px] text-text-body capitalize">{order.paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD'}</span>
            <span className={`text-[8px] uppercase tracking-[1px] px-2 py-0.5 rounded-[1px] ${
              order.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
              order.paymentStatus === 'REFUNDED' ? 'bg-warning/20 text-warning' :
              'bg-[rgba(196,122,138,0.2)] text-text-rose'
            }`}>
              {order.paymentStatus === 'PAID' ? 'Lunas' : order.paymentStatus === 'REFUNDED' ? 'Dikembalikan' : 'Belum Dibayar'}
            </span>
          </div>
          {order.paidAt && (
            <p className="text-[9px] text-text-muted">Lunas pada {formatDate(order.paidAt)}</p>
          )}
          {order.paymentProof && (
            <p className="text-[10px] text-text-muted mt-1">Ref: {order.paymentProof}</p>
          )}
        </motion.div>
      </div>

      {order.paymentMethod === 'transfer' && order.paymentStatus === 'UNPAID' && order.user.id === session?.user?.id && (
        <AnimatedSection>
          <div className="bg-bg-section border border-rose/20 rounded-[4px] p-5 mb-6">
            <h3 className="text-[11px] uppercase tracking-[2px] text-text-heading font-medium mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-rose" /> Konfirmasi Pembayaran
            </h3>
            <p className="text-[11px] text-text-muted mb-4">
              Transfer ke salah satu rekening di bawah ini, lalu konfirmasi dengan mengisi nomor referensi transfer.
            </p>

            <div className="space-y-2 mb-5">
              {bankAccounts.map((acc) => {
                const displayText = `${acc.bank} ${acc.accountNumber} a.n. ${acc.name}`
                return (
                  <div key={acc.bank} className="flex items-center justify-between bg-bg-primary border border-border/60 rounded-[2px] px-3 py-2.5 group">
                    <div>
                      <p className="text-[13px] font-medium text-text-heading">{acc.bank}</p>
                      <p className="text-[12px] text-text-body font-mono">{acc.accountNumber}</p>
                      <p className="text-[9px] text-text-muted">{acc.name}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        navigator.clipboard.writeText(displayText)
                        toast('success', 'Disalin!')
                      }}
                      className="text-text-muted hover:text-text-rose transition-colors opacity-0 group-hover:opacity-100"
                      title="Salin"
                    >
                      <Copy size={14} />
                    </motion.button>
                  </div>
                )
              })}
            </div>

            <p className="text-[10px] uppercase tracking-[1.5px] text-text-muted mb-2">Nomor Referensi Transfer</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan nomor referensi..."
                value={paymentProof}
                onChange={(e) => setPaymentProof(e.target.value)}
                className="flex-1 bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-3 py-2 text-[13px] transition-all duration-300"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  size="sm"
                  onClick={async () => {
                    if (!paymentProof.trim()) {
                      toast('error', 'Masukkan nomor referensi transfer')
                      return
                    }
                    setConfirmingPayment(true)
                    try {
                      const res = await fetch(`/api/orders/${id}/pay`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentProof: paymentProof.trim() }),
                      })
                      if (res.ok) {
                        const updated = await res.json()
                        setOrder((prev) => prev ? { ...prev, paymentStatus: updated.paymentStatus, paymentProof: updated.paymentProof, paidAt: updated.paidAt } : prev)
                        toast('success', 'Pembayaran berhasil dikonfirmasi!')
                        setPaymentProof('')
                      } else {
                        const err = await res.json()
                        toast('error', err.error || 'Gagal konfirmasi pembayaran')
                      }
                    } catch {
                      toast('error', 'Terjadi kesalahan')
                    }
                    setConfirmingPayment(false)
                  }}
                  disabled={confirmingPayment}
                >
                  {confirmingPayment ? '...' : 'Konfirmasi'}
                </Button>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      )}

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
                  <Image src={item.product.imageUrl} alt={item.product.name} fill sizes="56px" className="object-cover" unoptimized />
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

      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-2">
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
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowReceipt(true)}>
              <Printer size={12} /> Cetak Struk
            </Button>
          </motion.div>
        </div>
        <p className="text-text-rose text-[22px] font-heading">
          Total: <span className="font-semibold">{formatRupiah(order.totalAmount)}</span>
        </p>
      </div>

      {session?.user?.role === 'ADMIN' && (
        <AnimatedSection>
          <div className="bg-bg-section p-4 rounded-[4px] border-[0.5px] border-white/10 space-y-4">
            <div>
              <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-3">Update Status Pesanan</h3>
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

            <div>
              <h3 className="text-[9px] uppercase tracking-[2px] text-text-muted mb-3">Status Pembayaran</h3>
              <div className="flex flex-wrap gap-2">
                {['UNPAID', 'PAID', 'REFUNDED'].map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={updating || order.paymentStatus === s}
                    onClick={() => updateStatus(order.status, s)}
                    className={`text-[9px] uppercase tracking-[1.5px] px-3 py-1.5 rounded-[2px] transition-all duration-200 ${
                      order.paymentStatus === s
                     ? 'bg-success text-white'
                    : 'border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-success/50'
                    }`}
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
              {order.paymentProof && (
                <p className="text-[10px] text-text-muted mt-2">Ref: {order.paymentProof}</p>
              )}
            </div>
          </div>
        </AnimatedSection>
      )}

      {showReceipt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 print:items-start print:p-6 print:bg-white"
        >
          <div className="absolute inset-0 bg-black/70 print:hidden" onClick={() => setShowReceipt(false)} />
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-sm bg-bg-card print:bg-white border-[0.5px] border-white/10 print:border-none"
          >
            <div className="p-6 print:p-4">
              <div className="text-center mb-3">
                <h2 className="font-heading text-text-heading print:text-black text-lg">Brownies</h2>
                <p className="text-[8px] uppercase tracking-[2px] text-text-muted print:text-gray-600 mt-1">Struk Belanja</p>
              </div>

              <div className="border-t border-dashed border-white/20 print:border-gray-300 mb-3" />

              <div className="text-[10px] text-text-body print:text-gray-700 space-y-0.5 mb-3">
                <p>#ORD-{order.id.slice(0, 6).toUpperCase()}</p>
                <p>{new Date(order.createdAt).toLocaleString('id-ID')}</p>
              </div>

              <div className="border-t border-dashed border-white/20 print:border-gray-300 mb-3" />

              <div className="space-y-2 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4">
                    <div className="flex-1 text-[11px]">
                      <p className="text-text-heading print:text-black">{item.product.name}</p>
                      <p className="text-[9px] text-text-muted print:text-gray-500">
                        {item.quantity} &times; {formatRupiah(item.price)}
                      </p>
                    </div>
                    <p className="text-[11px] text-text-heading print:text-black whitespace-nowrap">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-white/20 print:border-gray-300 mb-3" />

              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[11px]">
                  <span className="text-text-muted print:text-gray-500">Subtotal</span>
                  <span className="text-text-body print:text-gray-700">{formatRupiah(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[13px] font-medium">
                  <span className="text-text-heading print:text-black">Total</span>
                  <span className="text-text-rose print:text-black">{formatRupiah(order.totalAmount)}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-white/20 print:border-gray-300 mb-3" />

              <div className="text-[9px] text-text-muted print:text-gray-500 text-center space-y-0.5 mb-3">
                <p className="uppercase tracking-[1px]">
                  {order.paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD'} &mdash; {order.paymentStatus}
                </p>
                <p>{order.shippingAddress}</p>
              </div>

              <div className="border-t border-dashed border-white/20 print:border-gray-300 mb-3" />

              <p className="text-[9px] text-text-muted print:text-gray-500 text-center">
                Terima kasih telah berbelanja!
              </p>
            </div>

            <div className="flex gap-2 p-4 pt-0 print:hidden">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                <Button variant="primary" size="sm" className="w-full flex items-center gap-2 justify-center" onClick={() => window.print()}>
                  <Printer size={12} /> Cetak
                </Button>
              </motion.div>
              <Button variant="outline" size="sm" onClick={() => setShowReceipt(false)}>
                Tutup
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
