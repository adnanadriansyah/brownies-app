'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Package, ShoppingCart, Users, Star, Tags,
  Plus, Trash2, Edit, LogOut, TrendingUp, AlertTriangle,
  DollarSign, ChevronRight, Menu, X, RefreshCw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatRupiah, formatDate } from '@/lib/utils'
import { StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

interface Category { id: string; name: string; slug: string; _count: { products: number } }
interface Product { id: string; name: string; slug: string; price: number; stock: number; imageUrl: string | null; isActive: boolean; category: { id: string; name: string }; createdAt: string }
interface Order { id: string; status: string; totalAmount: number; createdAt: string; user: { name: string; email: string }; items: { product: { name: string } }[] }
interface Review { id: string; rating: number; comment: string | null; createdAt: string; user: { name: string }; product: { name: string } }

type Tab = 'dashboard' | 'products' | 'orders' | 'categories' | 'reviews'

const statusStyles: Record<string, string> = {
  PENDING: 'bg-[rgba(196,122,138,0.2)] text-text-rose',
  PROCESSING: 'bg-[rgba(239,159,39,0.15)] text-warning',
  SHIPPED: 'bg-[rgba(55,138,221,0.15)] text-info',
  DELIVERED: 'bg-[rgba(63,122,50,0.2)] text-success',
  CANCELLED: 'bg-[rgba(226,75,74,0.15)] text-danger',
}

const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { key: 'products', label: 'Produk', icon: <Package size={15} /> },
  { key: 'orders', label: 'Pesanan', icon: <ShoppingCart size={15} /> },
  { key: 'categories', label: 'Kategori', icon: <Tags size={15} /> },
  { key: 'reviews', label: 'Ulasan', icon: <Star size={15} /> },
]

export default function AdminPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [tab, setTab] = useState<Tab>('dashboard')
  const [mobileSidebar, setMobileSidebar] = useState(false)
  const [allData, setAllData] = useState<{ products: Product[]; orders: Order[]; categories: Category[]; reviews: Review[] }>({ products: [], orders: [], categories: [], reviews: [] })
  const [loading, setLoading] = useState(true)

  const [showProductModal, setShowProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [prodName, setProdName] = useState('')
  const [prodSlug, setProdSlug] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodPrice, setProdPrice] = useState('')
  const [prodStock, setProdStock] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodCategory, setProdCategory] = useState('')
  const [prodActive, setProdActive] = useState(true)
  const [showCatModal, setShowCatModal] = useState(false)
  const [catName, setCatName] = useState('')
  const [catSlug, setCatSlug] = useState('')
  const [orderFilter, setOrderFilter] = useState('')

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    if (session.user?.role !== 'ADMIN') { router.push('/'); return }
    fetchData()
  }, [session, router])

  async function fetchData() {
    setLoading(true)
    try {
      const [pRes, oRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders?all=true'),
        fetch('/api/categories'),
      ])
      const pData = await pRes.json()
      const oData = await oRes.json()
      const cData = await cRes.json()
      const productsList: Product[] = pData.products || []

      const allReviews: Review[] = []
      for (const p of productsList.slice(0, 20)) {
        try {
          const r = await fetch(`/api/products/${p.id}`).then(r => r.json())
          if (r.reviews) allReviews.push(...r.reviews.map((rev: any) => ({
            id: rev.id, rating: rev.rating, comment: rev.comment,
            createdAt: rev.createdAt, user: rev.user, product: { name: p.name },
          })))
        } catch {}
      }

      setAllData({ products: productsList, orders: oData || [], categories: cData || [], reviews: allReviews })
    } catch {}
    setLoading(false)
  }

  if (!session || session.user?.role !== 'ADMIN') return null

  const { products, orders, categories, reviews } = allData
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.status === 'PENDING')
  const lowStockProducts = products.filter(p => p.isActive && p.stock <= 10)
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b-[0.5px] border-white/10">
        <Link href="/admin" className="font-heading text-text-heading text-base uppercase tracking-[3px]">Velours</Link>
        <p className="text-[8px] text-text-muted uppercase tracking-[2px] mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.key}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setTab(item.key); setMobileSidebar(false) }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-[11px] rounded-[2px] transition-all duration-200 ${
              tab === item.key
                ? 'bg-rose/10 text-text-rose border-l-[2px] border-rose'
                : 'text-text-muted hover:text-text-body hover:bg-white/[0.02] border-l-[2px] border-transparent'
            }`}
          >
            <span className={tab === item.key ? 'text-rose' : ''}>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </nav>
      <div className="p-3 border-t-[0.5px] border-white/10 space-y-1">
        <div className="px-3 py-2 text-[10px] text-text-muted truncate">
          {session.user?.name || session.user?.email}
        </div>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2 text-[11px] text-text-muted hover:text-danger transition-colors rounded-[2px] hover:bg-white/[0.02]"
        >
          <LogOut size={15} /> Keluar
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-bg-primary">
      {/* Desktop sidebar */}
      <aside className="w-[220px] bg-bg-sidebar border-r-[0.5px] border-border shrink-0 hidden md:flex flex-col">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebar(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileSidebar && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[240px] bg-bg-sidebar border-r border-border z-50 md:hidden"
          >
            {sidebar}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="h-14 border-b-[0.5px] border-border flex items-center px-4 gap-3 bg-bg-primary">
          <button
            onClick={() => setMobileSidebar(true)}
            className="md:hidden text-text-body hover:text-text-heading transition-colors"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={fetchData}
            className="text-text-muted hover:text-text-body transition-colors"
          >
            <RefreshCw size={14} />
          </motion.button>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── DASHBOARD ── */}
              {tab === 'dashboard' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="font-heading text-text-heading text-2xl">Dashboard</h1>
                      <p className="text-[11px] text-text-muted mt-1">Overview bisnis Velours Brownies</p>
                    </div>
                    <span className="text-[10px] text-text-muted">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                    {[
                      { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), icon: <DollarSign size={16} />, color: '#8ec87a' },
                      { label: 'Pesanan Masuk', value: String(pendingOrders.length), icon: <ShoppingCart size={16} />, color: '#fac775' },
                      { label: 'Produk Aktif', value: String(products.filter(p => p.isActive).length), icon: <Package size={16} />, color: '#85b7eb' },
                      { label: 'Kategori', value: String(categories.length), icon: <Tags size={16} />, color: '#e8a0b0' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-bg-card border-[0.5px] border-border rounded-[4px] p-4 card-hover"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[9px] uppercase tracking-[1.5px] text-text-muted">{stat.label}</p>
                          <span style={{ color: stat.color }}>{stat.icon}</span>
                        </div>
                        <p className="text-[22px] text-text-heading font-heading">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h2 className="font-heading text-text-heading text-sm uppercase tracking-[2px] mb-3">Pesanan Terbaru</h2>
                      <div className="bg-bg-card border-[0.5px] border-border rounded-[4px] divide-y-[0.5px] divide-[rgba(200,140,110,0.08)]">
                        {recentOrders.length === 0 && (
                          <p className="text-[12px] text-text-muted text-center py-8">Belum ada pesanan</p>
                        )}
                        {recentOrders.map((o, i) => (
                          <motion.div
                            key={o.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                          >
                            <div>
                              <p className="text-[12px] text-text-heading">{o.user.name}</p>
                              <p className="text-[10px] text-text-muted">#{o.id.slice(0, 6).toUpperCase()} &middot; {formatDate(o.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[12px] text-text-rose">{formatRupiah(o.totalAmount)}</p>
                              <span className={`text-[8px] uppercase tracking-[1px] px-2 py-0.5 rounded-[1px] ${statusStyles[o.status] || ''}`}>{o.status}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="font-heading text-text-heading text-sm uppercase tracking-[2px] mb-3">Stok Menipis</h2>
                      <div className="bg-bg-card border-[0.5px] border-border rounded-[4px] divide-y-[0.5px] divide-[rgba(200,140,110,0.08)]">
                        {lowStockProducts.length === 0 ? (
                          <p className="text-[12px] text-text-muted text-center py-8">Semua stok aman</p>
                        ) : (
                          lowStockProducts.slice(0, 8).map((p, i) => (
                            <motion.div
                              key={p.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <AlertTriangle size={12} className="text-warning shrink-0" />
                                <div>
                                  <p className="text-[12px] text-text-heading">{p.name}</p>
                                  <p className="text-[10px] text-text-muted">{p.category.name}</p>
                                </div>
                              </div>
                              <span className="text-[12px] text-danger">{p.stock}</span>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* ── PRODUCTS ── */}
              {tab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="font-heading text-text-heading text-2xl">Produk</h1>
                      <p className="text-[11px] text-text-muted mt-1">{products.length} total produk</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" onClick={() => {
                        setEditingProduct(null)
                        setProdName(''); setProdSlug(''); setProdDesc('')
                        setProdPrice(''); setProdStock(''); setProdImage('')
                        setProdCategory(''); setProdActive(true)
                        setShowProductModal(true)
                      }}>
                        <Plus size={12} /> Tambah Produk
                      </Button>
                    </motion.div>
                  </div>
                  <div className="overflow-x-auto bg-bg-card border-[0.5px] border-border rounded-[4px]">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b-[0.5px] border-border text-text-muted uppercase tracking-[1px]">
                          <th className="text-left py-3 px-4"></th>
                          <th className="text-left py-3 pr-4">Nama</th>
                          <th className="text-left py-3 pr-4">Kategori</th>
                          <th className="text-right py-3 pr-4">Harga</th>
                          <th className="text-right py-3 pr-4">Stok</th>
                          <th className="text-center py-3 pr-4">Status</th>
                          <th className="text-right py-3 pr-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((p, i) => (
                          <motion.tr
                            key={p.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`border-b-[0.5px] border-border transition-opacity duration-300 hover:bg-white/[0.02] ${!p.isActive ? 'opacity-50' : ''}`}
                          >
                            <td className="py-3 pl-4 pr-4">
                              <div className="w-10 h-10 bg-bg-card rounded-[2px] relative overflow-hidden">
                                {p.imageUrl && <Image src={p.imageUrl} alt="" fill sizes="40px" className="object-cover" />}
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-text-heading font-medium">{p.name}</td>
                            <td className="py-3 pr-4 text-text-muted">{p.category.name}</td>
                            <td className="py-3 pr-4 text-right text-text-rose">{formatRupiah(p.price)}</td>
                            <td className="py-3 pr-4 text-right">
                              <span className={p.stock <= 10 ? 'text-danger' : 'text-text-body'}>{p.stock}</span>
                              {p.stock <= 10 && <span className="ml-1 text-[7px] text-warning uppercase tracking-[1px]">Rendah</span>}
                            </td>
                            <td className="py-3 pr-4 text-center">
                              {!p.isActive && <span className="text-[7px] uppercase tracking-[1px] text-danger">Nonaktif</span>}
                              {p.isActive && <span className="text-[7px] uppercase tracking-[1px] text-success">Aktif</span>}
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <motion.button whileHover={{ scale: 1.1 }}
                                  onClick={() => {
                                    setEditingProduct(p)
                                    setProdName(p.name); setProdSlug(p.slug)
                                    setProdDesc(''); setProdPrice(String(p.price))
                                    setProdStock(String(p.stock)); setProdImage(p.imageUrl || '')
                                    setProdCategory(p.category.id); setProdActive(p.isActive)
                                    setShowProductModal(true)
                                  }}
                                  className="p-1.5 text-text-muted hover:text-text-heading transition-colors"
                                >
                                  <Edit size={11} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.1 }}
                                  onClick={async () => {
                                    if (confirm('Hapus produk ini?')) {
                                      await fetch(`/api/products/${p.id}`, { method: 'DELETE' })
                                      fetchData()
                                    }
                                  }}
                                  className="p-1.5 text-text-muted hover:text-danger transition-colors"
                                >
                                  <Trash2 size={11} />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── ORDERS ── */}
              {tab === 'orders' && (
                <div>
                  <div className="mb-6">
                    <h1 className="font-heading text-text-heading text-2xl">Pesanan</h1>
                    <p className="text-[11px] text-text-muted mt-1">{orders.length} total pesanan</p>
                  </div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {['', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
                      <motion.button
                        key={s}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setOrderFilter(s)}
                        className={`text-[9px] uppercase tracking-[1px] px-3 py-1.5 rounded-[2px] transition-all duration-200 ${
                          orderFilter === s
                            ? 'bg-rose text-white shadow-lg shadow-[#c47a8a]/20'
                            : 'border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-rose/50'
                        }`}
                      >
                        {s || 'Semua'}
                      </motion.button>
                    ))}
                  </div>
                  <div className="overflow-x-auto bg-bg-card border-[0.5px] border-border rounded-[4px]">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b-[0.5px] border-border text-text-muted uppercase tracking-[1px]">
                          <th className="text-left py-3 px-4">Order ID</th>
                          <th className="text-left py-3 pr-4">Pelanggan</th>
                          <th className="text-right py-3 pr-4">Total</th>
                          <th className="text-center py-3 pr-4">Status</th>
                          <th className="text-left py-3 pr-4">Tanggal</th>
                          <th className="text-right py-3 pr-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter((o) => !orderFilter || o.status === orderFilter).map((o, i) => (
                          <motion.tr
                            key={o.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b-[0.5px] border-border hover:bg-white/[0.02]"
                          >
                            <td className="py-3 pl-4 pr-4 text-rose font-mono font-medium">#ORD-{o.id.slice(0, 6).toUpperCase()}</td>
                            <td className="py-3 pr-4 text-text-body">{o.user.name}</td>
                            <td className="py-3 pr-4 text-right text-text-rose">{formatRupiah(o.totalAmount)}</td>
                            <td className="py-3 pr-4 text-center">
                              <span className={`text-[8px] uppercase tracking-[1px] px-2 py-0.5 rounded-[1px] ${statusStyles[o.status] || ''}`}>{o.status}</span>
                            </td>
                            <td className="py-3 pr-4 text-text-muted">{formatDate(o.createdAt)}</td>
                            <td className="py-3 pr-4 text-right">
                              <Link href={`/orders/${o.id}`} className="text-[9px] text-rose hover:text-text-rose uppercase tracking-[1px] transition-colors">
                                Detail
                              </Link>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── CATEGORIES ── */}
              {tab === 'categories' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="font-heading text-text-heading text-2xl">Kategori</h1>
                      <p className="text-[11px] text-text-muted mt-1">{categories.length} kategori</p>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button size="sm" onClick={() => { setCatName(''); setCatSlug(''); setShowCatModal(true) }}>
                        <Plus size={12} /> Tambah Kategori
                      </Button>
                    </motion.div>
                  </div>
                  <StaggerGrid className="grid gap-3">
                    {categories.map((cat) => (
                      <StaggerItem key={cat.id}>
                        <Card className="p-4 flex items-center justify-between group">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center">
                              <Tags size={12} className="text-rose" />
                            </div>
                            <div>
                              <p className="text-[13px] text-text-heading">{cat.name}</p>
                              <p className="text-[10px] text-text-muted">{cat.slug} &middot; {cat._count.products} produk</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <motion.button whileHover={{ scale: 1.1 }}
                              onClick={async () => {
                                const name = prompt('Nama baru:', cat.name)
                                if (name) {
                                  await fetch(`/api/categories/${cat.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ name, slug: name.toLowerCase().replace(/\s+/g, '-') }),
                                  })
                                  fetchData()
                                }
                              }}
                              className="text-[10px] text-text-body hover:text-text-heading transition-colors"
                            >
                              Edit
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }}
                              onClick={async () => {
                                if (cat._count.products > 0 && !confirm(`Kategori ini memiliki ${cat._count.products} produk. Hapus?`)) return
                                await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' })
                                fetchData()
                              }}
                              className="text-text-muted hover:text-danger transition-colors"
                            >
                              <Trash2 size={11} />
                            </motion.button>
                          </div>
                        </Card>
                      </StaggerItem>
                    ))}
                  </StaggerGrid>
                </div>
              )}

              {/* ── REVIEWS ── */}
              {tab === 'reviews' && (
                <div>
                  <div className="mb-6">
                    <h1 className="font-heading text-text-heading text-2xl">Ulasan</h1>
                    <p className="text-[11px] text-text-muted mt-1">{reviews.length} ulasan</p>
                  </div>
                  <div className="space-y-3">
                    {reviews.map((rev, i) => (
                      <motion.div
                        key={rev.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Card className="p-4 flex items-start justify-between gap-3 group">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[12px] text-text-heading font-medium">{rev.user.name}</span>
                              <span className="text-[10px] text-text-muted">pada {rev.product.name}</span>
                              <span className="text-[9px] text-text-muted">{formatDate(rev.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mb-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <span key={j} className={`text-[10px] ${j < rev.rating ? 'text-rose' : 'text-text-muted'}`}>&#9733;</span>
                              ))}
                            </div>
                            {rev.comment && <p className="text-[11px] text-text-body">{rev.comment}</p>}
                          </div>
                          <motion.button whileHover={{ scale: 1.1 }}
                            onClick={async () => {
                              await fetch(`/api/reviews/${rev.id}`, { method: 'DELETE' })
                              setAllData((prev) => ({ ...prev, reviews: prev.reviews.filter((r) => r.id !== rev.id) }))
                            }}
                            className="text-text-muted hover:text-danger transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </motion.button>
                        </Card>
                      </motion.div>
                    ))}
                    {reviews.length === 0 && (
                      <p className="text-text-muted text-[12px] text-center py-12">Belum ada ulasan</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Product Modal */}
      <Modal open={showProductModal} onClose={() => setShowProductModal(false)} title={editingProduct ? 'Edit Produk' : 'Tambah Produk'}>
        <div className="space-y-4">
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Nama</label>
            <Input value={prodName} onChange={(e) => {
              setProdName(e.target.value)
              if (!editingProduct) setProdSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
            }} />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Slug</label>
            <Input value={prodSlug} onChange={(e) => setProdSlug(e.target.value)} />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Deskripsi</label>
            <textarea
              value={prodDesc}
              onChange={(e) => setProdDesc(e.target.value)}
              rows={3}
              className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/20 rounded-[2px] px-3 py-2 text-[13px] resize-none transition-all duration-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Harga</label>
              <Input type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
            </div>
            <div>
              <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Stok</label>
              <Input type="number" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Gambar URL</label>
            <Input value={prodImage} onChange={(e) => setProdImage(e.target.value)} />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Kategori</label>
            <select
              value={prodCategory}
              onChange={(e) => setProdCategory(e.target.value)}
              className="w-full bg-bg-primary border border-border/80 text-text-heading focus:outline-none focus:border-rose rounded-[2px] px-3 py-2 text-[13px] transition-all duration-300"
            >
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-[11px] text-text-body cursor-pointer">
            <input type="checkbox" checked={prodActive} onChange={(e) => setProdActive(e.target.checked)} className="accent-rose" />
            Produk Aktif
          </label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="sm" className="w-full" onClick={async () => {
              const body = {
                name: prodName, slug: prodSlug, description: prodDesc,
                price: parseFloat(prodPrice), stock: parseInt(prodStock),
                imageUrl: prodImage || undefined, categoryId: prodCategory,
                isActive: prodActive,
              }
              if (editingProduct) {
                await fetch(`/api/products/${editingProduct.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
              } else {
                await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                })
              }
              setShowProductModal(false)
              fetchData()
            }}>
              {editingProduct ? 'Simpan Perubahan' : 'Tambah Produk'}
            </Button>
          </motion.div>
        </div>
      </Modal>

      {/* Category Modal */}
      <Modal open={showCatModal} onClose={() => setShowCatModal(false)} title="Tambah Kategori">
        <div className="space-y-4">
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Nama</label>
            <Input value={catName} onChange={(e) => { setCatName(e.target.value); setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-')) }} />
          </div>
          <div>
            <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Slug</label>
            <Input value={catSlug} onChange={(e) => setCatSlug(e.target.value)} />
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="sm" className="w-full" onClick={async () => {
              await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: catName, slug: catSlug }),
              })
              setShowCatModal(false)
              fetchData()
            }}>
              Simpan
            </Button>
          </motion.div>
        </div>
      </Modal>
    </div>
  )
}
