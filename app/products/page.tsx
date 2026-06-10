'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, useCallback, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, Plus, Star, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { StaggerGrid, StaggerItem, AnimatedSection } from '@/components/ui/AnimatedSection'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  imageUrl: string | null
  isActive: boolean
  category: { id: string; name: string }
  _count: { reviews: number }
}

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

function ProductsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const addItem = useCart((s) => s.addItem)

  const [categories, setCategories] = useState<Category[]>([])
  const [data, setData] = useState<ProductsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [imgLoaded, setImgLoaded] = useState<Record<string, boolean>>({})

  const category = searchParams.get('category') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const searchQ = searchParams.get('search') || ''

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (searchQ) params.set('search', searchQ)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (page > 1) params.set('page', String(page))
    params.set('limit', '9')

    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, searchQ, minPrice, maxPrice, page])

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      if (key !== 'page') params.delete('page')
      router.push(`/products?${params}`)
    },
    [router, searchParams],
  )

  let debounceTimer: ReturnType<typeof setTimeout>
  const handleSearch = (value: string) => {
    setSearch(value)
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => updateParam('search', value), 400)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AnimatedSection>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-text-heading text-3xl">Menu</h1>
            <p className="text-[11px] text-text-muted mt-1">
              {data ? `${data.total} varian brownies` : 'Memuat...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Cari brownies..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-bg-card border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/20 rounded-[2px] pl-9 pr-3 py-2 text-[13px] transition-all duration-300"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] transition-colors duration-200 px-3 py-2 rounded-[2px] ${
                showFilters || minPrice || maxPrice
                  ? 'bg-rose/10 text-text-rose border border-rose/30'
                  : 'text-text-body hover:text-text-rose'
              }`}
            >
              <SlidersHorizontal size={14} />
              Filter
            </motion.button>
          </div>
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <Card className="p-4 mb-6 flex flex-wrap items-end gap-4">
              <div>
                <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Harga Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-28 bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-3 py-1.5 text-[12px] transition-all duration-300"
                />
              </div>
              <div>
                <label className="text-[9px] uppercase tracking-[1.5px] text-text-muted block mb-1">Harga Max</label>
                <input
                  type="number"
                  placeholder="999999"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-28 bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-3 py-1.5 text-[12px] transition-all duration-300"
                />
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" onClick={() => { updateParam('minPrice', minPrice); updateParam('maxPrice', maxPrice) }}>
                  Terapkan
                </Button>
              </motion.div>
              {(minPrice || maxPrice) && (
                <button
                  onClick={() => { setMinPrice(''); setMaxPrice(''); const p = new URLSearchParams(searchParams.toString()); p.delete('minPrice'); p.delete('maxPrice'); router.push(`/products?${p}`) }}
                  className="text-[10px] text-text-muted hover:text-danger flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Hapus
                </button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatedSection delay={0.1}>
        <div className="flex flex-wrap gap-2 mb-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateParam('category', '')}
            className={`px-4 py-1.5 text-[10px] uppercase tracking-[1.5px] rounded-full transition-all duration-300 ${
              !category
                ? 'bg-rose text-white shadow-lg shadow-rose/20'
                : 'bg-bg-card text-text-muted hover:text-text-body border border-border hover:border-rose/30'
            }`}
          >
            Semua
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => updateParam('category', cat.id)}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-[1.5px] rounded-full transition-all duration-300 ${
                category === cat.id
                ? 'bg-rose text-white shadow-lg shadow-rose/20'
                : 'bg-bg-card text-text-muted hover:text-text-body border border-border hover:border-rose/30'
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : data && data.products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <p className="text-text-muted text-[14px] mb-2">Tidak ada produk ditemukan</p>
          <p className="text-[11px] text-text-muted">Coba ubah filter atau kata kunci pencarian</p>
        </motion.div>
      ) : (
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.products.map((product) => (
            <StaggerItem key={product.id}>
              <Card className="overflow-hidden group h-full flex flex-col">
                <Link href={`/products/${product.id}`} className="block relative h-[180px] bg-bg-primary overflow-hidden">
                  {product.imageUrl ? (
                    <>
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={`object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded[product.id] ? 'image-loaded' : 'image-loading'}`}
                        onLoad={() => setImgLoaded((prev) => ({ ...prev, [product.id]: true }))}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-text-muted text-[11px]">No Image</div>
                  )}
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-[9px] text-text-muted uppercase tracking-[1.5px] mb-1">
                    {product.category.name}
                  </p>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-heading text-text-heading text-lg leading-tight mb-2 hover:text-text-rose transition-colors duration-300">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-3">
                    <Star size={10} className="text-rose fill-[#c47a8a]" />
                    <span className="text-[9px] text-text-muted">({product._count.reviews})</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-text-rose text-[16px] font-medium">
                      {formatRupiah(product.price)}
                    </span>
                    {product.stock > 0 ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          addItem(
                            { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, stock: product.stock },
                            1,
                          )
                        }
                        className="w-8 h-8 bg-rose hover:bg-rose-hover text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-rose/20 hover:shadow-text-rose/30"
                      >
                        <Plus size={14} />
                      </motion.button>
                    ) : (
                      <span className="text-[8px] uppercase tracking-[1.5px] text-danger">Habis</span>
                    )}
                  </div>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}

      {data && data.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateParam('page', String(page - 1))}
            disabled={page <= 1}
            className="text-[10px] uppercase tracking-[1.5px] text-text-body hover:text-text-heading disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
          >
            &larr; Prev
          </motion.button>
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
            <motion.button
              key={p}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => updateParam('page', String(p))}
              className={`w-8 h-8 text-[11px] rounded-full transition-all duration-300 ${
                p === page
                  ? 'bg-rose text-white shadow-lg shadow-rose/20'
                  : 'text-text-muted hover:text-text-heading hover:bg-white/[0.04]'
              }`}
            >
              {p}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateParam('page', String(page + 1))}
            disabled={page >= data.totalPages}
            className="text-[10px] uppercase tracking-[1.5px] text-text-body hover:text-text-heading disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next &rarr;
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
