'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatRupiah } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { useWishlist, useSyncWishlist } from '@/hooks/useWishlist'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { useToast } from '@/components/ui/Toast/Toast'

export default function WishlistPage() {
  const router = useRouter()
  const { data: session } = useSession()

  useSyncWishlist()

  const items = useWishlist((s) => s.items)
  const loading = useWishlist((s) => s.loading)
  const removeItem = useWishlist((s) => s.removeItem)
  const addItem = useCart((s) => s.addItem)
  const toast = useToast((s) => s.addToast)

  useEffect(() => {
    if (!session) router.push('/login')
  }, [session, router])

  if (!session) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-8">
          <motion.button whileHover={{ x: -3 }} onClick={() => router.back()}>
            <ArrowLeft size={14} className="text-text-muted hover:text-text-rose transition-colors" />
          </motion.button>
          <h1 className="font-heading text-text-heading text-2xl">Wishlist</h1>
          <span className="text-[11px] text-text-muted">({items.length} item)</span>
        </div>
      </AnimatedSection>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-[4px] overflow-hidden">
              <div className="shimmer aspect-square w-full" />
              <div className="p-4 space-y-3">
                <div className="shimmer h-3 w-24" />
                <div className="shimmer h-4 w-32" />
                <div className="shimmer h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Heart size={40} className="mx-auto text-text-muted mb-4" />
          <p className="text-text-muted mb-2">Wishlist masih kosong</p>
          <p className="text-[11px] text-text-muted mb-6">Simpan brownies favoritmu di sini</p>
          <Link href="/products">
            <Button variant="outline">Jelajahi Menu</Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                className="group bg-bg-card border border-border rounded-[4px] overflow-hidden card-hover"
              >
                <div className="relative aspect-square bg-bg-primary">
                  <Link href={`/products/${item.product.id}`}>
                    {item.product.imageUrl ? (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 25vw"
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[9px] text-text-muted">No Image</div>
                    )}
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={async () => {
                      await removeItem(item.productId)
                      toast('error', 'Dihapus dari wishlist')
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-bg-card/90 backdrop-blur-sm border border-border/80 rounded-full flex items-center justify-center text-danger hover:bg-danger/10 transition-colors"
                  >
                    <Trash2 size={12} />
                  </motion.button>
                  {item.product.stock === 0 && (
                    <div className="absolute bottom-2 left-2 text-[8px] uppercase tracking-[1px] bg-danger/80 text-white px-2 py-0.5 rounded-[1px]">
                      Habis
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-heading text-text-heading text-sm mb-1 group-hover:text-text-rose transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mb-2">
                    <Star size={10} className="text-rose fill-[#c47a8a]" />
                    <span className="text-[9px] text-text-muted">
                      {item.product.rating > 0 ? item.product.rating.toFixed(1) : '-'} ({item.product.reviewCount})
                    </span>
                  </div>
                  <p className="text-text-rose text-[16px] font-heading mb-3">
                    {formatRupiah(item.product.price)}
                  </p>
                  {item.product.stock > 0 ? (
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={() => {
                          addItem({
                            productId: item.product.id,
                            name: item.product.name,
                            price: item.product.price,
                            imageUrl: item.product.imageUrl,
                            stock: item.product.stock,
                          }, 1)
                          toast('success', 'Ditambahkan ke keranjang')
                        }}
                      >
                        <ShoppingBag size={11} /> Keranjang
                      </Button>
                    </motion.div>
                  ) : (
                    <Button size="sm" className="w-full" disabled>Habis</Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
