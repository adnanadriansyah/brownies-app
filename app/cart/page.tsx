'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Minus, Plus, MapPin, ShoppingBag, ArrowLeft, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface Address {
  id: string
  label: string
  street: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cod'>('transfer')
  const [placing, setPlacing] = useState(false)
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const [addrLabel, setAddrLabel] = useState('')
  const [addrStreet, setAddrStreet] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrProvince, setAddrProvince] = useState('')
  const [addrPostal, setAddrPostal] = useState('')
  const [addrDefault, setAddrDefault] = useState(false)

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetch('/api/addresses')
      .then((r) => r.json())
      .then((data: Address[]) => {
        setAddresses(data)
        const def = data.find((a) => a.isDefault)
        if (def) setSelectedAddress(def.id)
      })
      .catch(() => {})
  }, [session, router])

  const selectedAddr = addresses.find((a) => a.id === selectedAddress)
  const FREE_SHIPPING_MIN = 200000
  const shipping = subtotal() >= FREE_SHIPPING_MIN ? 0 : 25000
  const total = subtotal() + shipping

  async function addAddress() {
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: addrLabel, street: addrStreet, city: addrCity, province: addrProvince, postalCode: addrPostal, isDefault: addrDefault }),
    })
    if (res.ok) {
      const addr: Address = await res.json()
      setAddresses((prev) => [...prev, addr])
      if (addrDefault) setSelectedAddress(addr.id)
      setShowAddressModal(false)
      setAddrLabel(''); setAddrStreet(''); setAddrCity(''); setAddrProvince(''); setAddrPostal(''); setAddrDefault(false)
    }
  }

  async function placeOrder() {
    if (!selectedAddr) return
    setPlacing(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: `${selectedAddr.street}, ${selectedAddr.city}, ${selectedAddr.province} ${selectedAddr.postalCode}`,
          paymentMethod,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
        }),
      })
      if (res.ok) {
        const order = await res.json()
        clearCart()
        setOrderSuccess(true)
        setTimeout(() => router.push(`/orders/${order.id}`), 1200)
      } else {
        const err = await res.json()
        alert(err.error || 'Gagal membuat pesanan')
      }
    } catch { alert('Terjadi kesalahan') }
    finally { setPlacing(false) }
  }

  if (!session) return null

  if (orderSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-success" />
          </div>
          <p className="font-heading text-text-heading text-xl">Pesanan Berhasil Dibuat!</p>
          <p className="text-[11px] text-text-muted mt-2">Mengarahkan ke detail pesanan...</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-8">
          <motion.button whileHover={{ x: -3 }} onClick={() => router.back()}>
            <ArrowLeft size={14} className="text-text-muted hover:text-text-rose transition-colors" />
          </motion.button>
          <h1 className="font-heading text-text-heading text-2xl">Keranjang Kamu</h1>
          <span className="text-[11px] text-text-muted">({items.length} item)</span>
        </div>
      </AnimatedSection>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
          <ShoppingBag size={40} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted mb-4">Belum ada item</p>
          <Link href="/products">
            <Button variant="outline">Lihat Menu</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-start">
          <div>
            <AnimatePresence mode="popLayout">
              {items.map((item, i) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center gap-4 py-4 border-b-[0.5px] border-white/10 group"
                >
                  <div className="relative w-16 h-16 shrink-0 bg-bg-card overflow-hidden rounded-[2px]">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[9px] text-[#4a2218]">No Img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-text-heading truncate font-medium">{item.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-6 h-6 border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-[#c47a8a]/50 flex items-center justify-center transition-all duration-200"
                    >
                      <Minus size={10} />
                    </motion.button>
                    <motion.span key={item.quantity} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="text-[13px] text-text-heading w-5 text-center font-mono">
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-6 h-6 border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-[#c47a8a]/50 flex items-center justify-center transition-all duration-200"
                    >
                      <Plus size={10} />
                    </motion.button>
                  </div>
                  <p className="text-text-rose text-[13px] w-20 text-right font-medium">
                    {formatRupiah(item.price * item.quantity)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeItem(item.productId)}
                    className="text-text-muted hover:text-danger transition-colors duration-200 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatedSection delay={0.2}>
              <div className="mt-6">
                <h3 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-3 flex items-center gap-2">
                  <MapPin size={12} className="text-rose" /> Alamat Pengiriman
                </h3>
                {addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <motion.label
                        key={addr.id}
                        whileHover={{ borderColor: 'rgba(196,122,138,0.3)' }}
                        className={`flex items-start gap-3 p-3 border-[0.5px] rounded-[2px] cursor-pointer transition-all duration-200 ${
                          selectedAddress === addr.id
                            ? 'border-[#c47a8a] bg-rose/5'
                            : 'border-border'
                        }`}
                      >
                        <input type="radio" name="address" checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} className="mt-0.5 accent-[#c47a8a]" />
                        <div>
                        <p className="text-[12px] text-text-heading font-medium">
                          {addr.label}
                          {addr.isDefault && <span className="ml-2 text-[8px] text-text-rose uppercase tracking-[1px]">Default</span>}
                        </p>
                        <p className="text-[11px] text-text-muted">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                        </div>
                      </motion.label>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-text-muted">Belum ada alamat</p>
                )}
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={() => setShowAddressModal(true)}
                  className="mt-2 text-[10px] uppercase tracking-[1.5px] text-rose hover:text-text-rose transition-colors duration-200"
                >
                  + Tambah Alamat Baru
                </motion.button>
              </div>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.15}>
            <div className="bg-bg-section p-5 h-fit sticky top-24">
              <h3 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-4">Ringkasan</h3>
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-text-body">Subtotal</span>
                  <span className="text-text-heading">{formatRupiah(subtotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-body">Ongkir</span>
                  <span className={shipping === 0 ? 'text-success' : 'text-text-heading'}>
                    {shipping === 0 ? 'GRATIS' : formatRupiah(shipping)}
                  </span>
                </div>
                {subtotal() < FREE_SHIPPING_MIN && (
                  <p className="text-[9px] text-text-rose">
                    Belanja Rp {(FREE_SHIPPING_MIN - subtotal()).toLocaleString('id-ID')} lagi untuk gratis ongkir
                  </p>
                )}
                <div className="border-t-[0.5px] border-border pt-2 mt-2 flex justify-between font-medium">
                  <span className="text-text-body">Total</span>
                  <span className="text-text-rose text-[16px]">{formatRupiah(total)}</span>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-[9px] uppercase tracking-[2px] text-text-muted block mb-2">Pembayaran</label>
                <div className="space-y-2">
                  {['transfer', 'cod'].map((m) => (
                    <label key={m} className="flex items-center gap-2 text-[12px] text-text-body cursor-pointer hover:text-text-heading transition-colors">
                      <input type="radio" name="payment" value={m} checked={paymentMethod === m} onChange={() => setPaymentMethod(m as any)} className="accent-[#c47a8a]" />
                      {m === 'transfer' ? 'Transfer Bank' : 'COD'}
                    </label>
                  ))}
                </div>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button variant="primary" size="lg" className="w-full mt-5" disabled={!selectedAddr || placing} onClick={placeOrder}>
                  {placing ? 'Memproses...' : 'Buat Pesanan'}
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      )}

      <Modal open={showAddressModal} onClose={() => setShowAddressModal(false)} title="Tambah Alamat Baru">
        <div className="space-y-4">
          {(['label', 'street', 'city', 'postalCode'] as const).map((f) => (
            <div key={f}>
                <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">
                {f === 'label' ? 'Label' : f === 'street' ? 'Jalan' : f === 'city' ? 'Kota' : 'Kode Pos'}
              </label>
              <Input
                placeholder={f === 'label' ? 'Rumah / Kantor' : f === 'street' ? 'Nama jalan' : f === 'city' ? 'Kota' : '12345'}
                value={f === 'label' ? addrLabel : f === 'street' ? addrStreet : f === 'city' ? addrCity : addrPostal}
                onChange={(e) => {
                  const v = e.target.value
                  if (f === 'label') setAddrLabel(v)
                  else if (f === 'street') setAddrStreet(v)
                  else if (f === 'city') setAddrCity(v)
                  else setAddrPostal(v)
                }}
              />
            </div>
          ))}
          <label className="flex items-center gap-2 text-[11px] text-text-body cursor-pointer">
            <input type="checkbox" checked={addrDefault} onChange={(e) => setAddrDefault(e.target.checked)} className="accent-[#c47a8a]" />
            Jadikan default
          </label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="sm" className="w-full" onClick={addAddress}>Simpan</Button>
          </motion.div>
        </div>
      </Modal>
    </div>
  )
}
