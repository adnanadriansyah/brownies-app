'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Star, Trash2, Minus, Plus, Heart, ChevronLeft, ShoppingBag, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatRupiah, formatDate } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { AnimatedSection, StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: { id: string; name: string }
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  imageUrl: string | null
  category: { id: string; name: string }
  reviews: Review[]
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = useSession()
  const addItem = useCart((s) => s.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => { setProduct(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="shimmer h-[480px] rounded-[4px]" />
          <div className="space-y-4">
            <div className="shimmer h-4 w-32" />
            <div className="shimmer h-8 w-64" />
            <div className="shimmer h-6 w-48" />
            <div className="shimmer h-24 w-full" />
            <div className="shimmer h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center gap-4"
      >
        <p className="text-text-muted">Produk tidak ditemukan</p>
        <Link href="/products">
          <Button variant="outline">Kembali</Button>
        </Link>
      </motion.div>
    )
  }

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0

  async function submitReview() {
    if (!session) { router.push('/login'); return }
    if (rating === 0) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment }),
      })
      if (res.ok) {
        const newReview = await res.json()
        setProduct((prev) => prev ? { ...prev, reviews: [newReview, ...prev.reviews] } : prev)
        setRating(0)
        setComment('')
      }
    } finally {
      setSubmitting(false)
    }
  }

  async function deleteReview(reviewId: string) {
    const res = await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' })
    if (res.ok) {
      setProduct((prev) => prev ? { ...prev, reviews: prev.reviews.filter((r) => r.id !== reviewId) } : prev)
    }
  }

  function handleAddToCart() {
    if (!session) { router.push('/login'); return }
    if (!product) return
    addItem(
      { productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, stock: product.stock },
      qty,
    )
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.button
        whileHover={{ x: -3 }}
        onClick={() => router.back()}
        className="flex items-center gap-1 text-[10px] uppercase tracking-[1.5px] text-text-muted hover:text-text-rose transition-colors duration-200 mb-6"
      >
        <ChevronLeft size={12} /> Kembali
      </motion.button>

      <div className="grid md:grid-cols-2 gap-0 md:gap-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[320px] md:min-h-[520px] bg-bg-card overflow-hidden group"
        >
          {product.imageUrl ? (
            <>
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-all duration-700 group-hover:scale-105 ${imgLoaded ? 'image-loaded' : 'image-loading'}`}
                unoptimized
                onLoad={() => setImgLoaded(true)}
                preload
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-text-muted text-[11px]">No Image</div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-bg-section p-6 md:p-8"
        >
          <p className="text-[9px] text-text-muted uppercase tracking-[2px] mb-3">
            <Link href="/products" className="hover:text-text-rose transition-colors">Menu</Link>
            <span className="mx-2">/</span>
            <span className="text-text-body">{product.category.name}</span>
          </p>

          <h1 className="font-heading text-text-heading text-3xl md:text-[34px] leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center gap-1 mb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Star
                  size={14}
                  className={i < Math.round(avgRating) ? 'text-rose fill-[#c47a8a]' : 'text-text-muted'}
                />
              </motion.span>
            ))}
            <span className="text-[10px] text-text-muted ml-2">({product.reviews.length} ulasan)</span>
          </div>

          <p className="text-gradient text-[28px] font-heading font-semibold mb-6">
            {formatRupiah(product.price)}
          </p>

          {product.description && (
            <p className="text-[13px] text-text-body leading-relaxed mb-6 border-l-[0.5px] border-rose/30 pl-4">
              {product.description}
            </p>
          )}

          <div className="mb-6">
            <label className="text-[9px] uppercase tracking-[2px] text-text-muted block mb-3">
              Jumlah
            </label>
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-rose/50 flex items-center justify-center transition-all duration-200"
              >
                <Minus size={12} />
              </motion.button>
              <motion.span
                key={qty}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-text-heading text-[15px] w-6 text-center font-mono"
              >
                {qty}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-8 h-8 border-[0.5px] border-border/80 text-text-body hover:text-text-heading hover:border-rose/50 flex items-center justify-center transition-all duration-200"
              >
                <Plus size={12} />
              </motion.button>
              <span className={`text-[10px] ml-2 ${product.stock <= 5 ? 'text-text-rose' : 'text-text-muted'}`}>
                Stok: {product.stock}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {product.stock > 0 ? (
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button
                  variant="primary"
                  size="lg"
                  className={`w-full group relative ${addedToCart ? 'bg-success hover:bg-success' : ''}`}
                  onClick={handleAddToCart}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={12} /> Ditambahkan
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={12} /> Tambah ke Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            ) : (
              <Button variant="primary" size="lg" className="w-full" disabled>
                Habis
              </Button>
            )}
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setWishlisted(!wishlisted)}
              >
                <motion.span
                  animate={wishlisted ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={12} className={wishlisted ? 'fill-rose' : ''} />
                </motion.span>
                {wishlisted ? 'Tersimpan' : 'Simpan ke Wishlist'}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatedSection className="mt-16">
        <h2 className="font-heading text-text-heading text-2xl mb-6 flex items-center gap-3">
          Ulasan Pelanggan
          <span className="text-[11px] text-text-muted font-body font-normal">
            ({product.reviews.length})
          </span>
        </h2>

        {session ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-5 mb-6">
              <h3 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-3">Tulis Ulasan</h3>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(i + 1)}
                  >
                    <Star
                      size={18}
                      className={`transition-colors duration-200 ${
                        i < rating ? 'text-rose fill-[#c47a8a]' : 'text-text-muted hover:text-text-muted'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <textarea
                placeholder="Tulis komentar..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/20 rounded-[2px] px-3 py-2 text-[13px] resize-none transition-all duration-300 mb-3"
              />
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button size="sm" onClick={submitReview} disabled={rating === 0 || submitting}>
                  {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        ) : (
          <Card className="p-5 mb-6 text-center">
            <p className="text-[12px] text-text-muted">
              <Link href="/login" className="text-rose hover:text-text-rose transition-colors">Login</Link>
              {' '}untuk menulis ulasan
            </p>
          </Card>
        )}

        <div className="space-y-3">
          <AnimatePresence>
            {product.reviews.length === 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-text-muted text-[12px] text-center py-8"
              >
                Belum ada ulasan
              </motion.p>
            )}
          </AnimatePresence>
          {product.reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 flex gap-3 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-rose to-[#e8a0b0] flex items-center justify-center text-white text-[12px] font-medium shrink-0"
                >
                  {review.user.name.charAt(0)}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-text-heading font-medium">{review.user.name}</span>
                      <span className="text-[9px] text-text-muted">{formatDate(review.createdAt)}</span>
                    </div>
                    {(session?.user?.id === review.user.id || session?.user?.role === 'ADMIN') && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => deleteReview(review.id)}
                        className="text-text-muted hover:text-danger transition-colors duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={12} />
                      </motion.button>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        size={10}
                        className={j < review.rating ? 'text-rose fill-[#c47a8a]' : 'text-text-muted'}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-[12px] text-text-body leading-relaxed">{review.comment}</p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  )
}
