'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Truck, Shield, Heart, ChefHat, Award, Leaf, Clock, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

const articles = [
  { href: '/blog/tips-menyimpan-brownies', title: 'Tips Menyimpan Brownies agar Tetap Fresh', image: '/blog-brownies-1.jpg' },
  { href: '/blog/perbedaan-brownies-fudgy-cakey', title: 'Fudgy vs Cakey: Mana yang Cocok untukmu?', image: '/blog-brownies-2.jpg' },
  { href: '/blog/brownies-untuk-acara-spesial', title: '5 Ide Brownies untuk Acara Spesialmu', image: '/blog-brownies-3.jpg' },
]

const categories = [
  { name: 'All Brownies', href: '/products', count: '12+ varian' },
  { name: 'Classic', href: '/products', count: 'Fudgy & Chewy' },
  { name: 'Premium', href: '/products', count: 'Topping Spesial' },
  { name: 'Gift Box', href: '/products', count: 'Hadiah Istimewa' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/products?limit=6')
      .then((r) => r.json())
      .then((data) => setFeatured(data.products || data || []))
      .catch(() => {})
  }, [])

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[600px] grid md:grid-cols-2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,122,138,0.08),transparent_60%)] pointer-events-none"
        />

        <div className="bg-bg-section flex flex-col justify-center px-8 md:px-16 py-20 relative">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[10px] uppercase tracking-[3px] text-text-muted mb-6 inline-flex items-center gap-2"
          >
            <span className="w-6 h-[0.5px] bg-rose" />
            Artisan &middot; Handcrafted Daily
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="font-heading text-text-heading text-5xl md:text-6xl leading-[1.1] mb-4"
          >
            Brownies{' '}
            <span className="italic text-gradient">Velours</span>
            <br />
            untuk{' '}
            <span className="italic text-gradient">Setiap</span> Momen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[14px] text-text-muted leading-relaxed max-w-md mb-8"
          >
            Dibuat setiap hari dengan cinta dan bahan terbaik.
            Setiap gigitan adalah pengalaman yang tak terlupakan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex gap-3 flex-wrap"
          >
            <Link href="/products">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="primary" size="lg" className="group">
                  Lihat Menu
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">Tentang Kami</Button>
            </Link>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-card to-[#1a0f0a]">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <Image
              src="/hero-new.jpg"
              alt="Brownies Velours"
              width={736}
              height={920}
              className="object-contain max-h-[90vh] w-auto h-auto"
              preload
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f0a]/60 via-transparent to-transparent pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-6 right-6 bg-bg-card/90 backdrop-blur-xl border border-border/80 rounded-[4px] px-5 py-4"
          >
            <p className="text-[9px] uppercase tracking-[2px] text-text-muted">Mulai dari</p>
            <p className="font-heading text-text-rose text-2xl">Rp 35.000</p>
          </motion.div>
        </div>
      </section>

      {/* ── PROMO STRIP ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="bg-bg-card border-y-[0.5px] border-border"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 gap-4">
          {[
            { icon: <Truck size={14} />, text: 'Gratis ongkir min. Rp 200K' },
            { icon: <Shield size={14} />, text: 'Bahan premium terjamin' },
            { icon: <Heart size={14} />, text: 'Handmade dengan cinta' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[1.5px] text-text-muted">
              <span className="text-rose">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── QUICK CATEGORIES ── */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[0.5px] bg-rose" />
              Kategori
            </span>
            <h2 className="font-heading text-text-heading text-3xl md:text-4xl">
              Jelajahi{' '}
              <span className="italic text-gradient">Koleksi</span> Kami
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link href={cat.href} className="group block card-hover">
                  <div className="bg-bg-card border border-border rounded-[4px] p-6 text-center hover:border-[rgba(196,122,138,0.4)] transition-all duration-300">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-rose/10 flex items-center justify-center text-rose group-hover:bg-rose/20 transition-colors">
                      <ShoppingBag size={18} />
                    </div>
                    <h3 className="font-heading text-text-heading text-sm uppercase tracking-[2px] mb-1">{cat.name}</h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-[1.5px]">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="py-16 md:py-20 bg-bg-section">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-end justify-between mb-10"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-3">
                  <span className="w-6 h-[0.5px] bg-rose" />
                  Best Seller
                </span>
                <h2 className="font-heading text-text-heading text-3xl md:text-4xl">
                  Brownies{' '}
                  <span className="italic text-gradient">Pilihan</span>
                </h2>
              </div>
              <Link href="/products" className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-rose hover:text-text-rose transition-colors">
                Lihat Semua <ArrowRight size={12} />
              </Link>
            </motion.div>

            <StaggerGrid className="grid md:grid-cols-3 gap-5">
              {featured.slice(0, 6).map((product: any) => (
                <StaggerItem key={product.id}>
                  <Link href={`/products/${product.id}`} className="group block card-hover">
                    <article className="bg-bg-card border border-border rounded-[4px] overflow-hidden">
                      <div className="relative aspect-square overflow-hidden bg-bg-primary">
                        {product.imageUrl ? (
                          <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-all duration-700 group-hover:scale-110" unoptimized />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[9px] text-text-muted">No Image</div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-text-heading text-sm mb-1 group-hover:text-text-rose transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[20px] font-heading text-text-rose">
                          Rp {product.price?.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </article>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8 md:hidden"
            >
              <Link href="/products">
                <Button variant="outline">Lihat Semua Produk</Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── ABOUT PREVIEW ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-4">
                <span className="w-6 h-[0.5px] bg-rose" />
                Tentang Velours
              </span>
              <h2 className="font-heading text-text-heading text-3xl md:text-4xl leading-[1.15] mb-4">
                Cerita di Balik{' '}
                <span className="italic text-gradient">Setiap Gigitan</span>
              </h2>
              <p className="text-[13px] text-text-muted leading-relaxed mb-6">
                Berawal dari dapur kecil di tahun 2020, Velours lahir dari hasrat untuk menciptakan brownies
                yang bukan sekadar kue — tetapi pengalaman. Setiap resep diuji puluhan kali hingga menemukan
                keseimbangan sempurna antara fudgy dan chewy.
              </p>
              <Link href="/about">
                <Button variant="primary" className="group">
                  Baca Cerita Kami
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { icon: <ChefHat size={20} />, title: 'Artisan', desc: 'Tangan terampil, resep turun-temurun' },
                { icon: <Award size={20} />, title: 'Premium', desc: 'Cokelat Belgia & mentega Eropa' },
                { icon: <Heart size={20} />, title: 'Love', desc: 'Dipanggang dengan penuh cinta' },
                { icon: <Leaf size={20} />, title: 'Natural', desc: 'Tanpa pengawet, fresh daily' },
              ].map((item) => (
                <div key={item.title} className="bg-bg-card border border-border rounded-[4px] p-5 card-hover">
                  <div className="text-rose mb-3">{item.icon}</div>
                  <h3 className="font-heading text-text-heading text-sm uppercase tracking-[2px] mb-1">{item.title}</h3>
                  <p className="text-[10px] text-text-muted">{item.desc}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHY VELOURS ── */}
      <section className="py-16 md:py-24 bg-bg-section">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-[0.5px] bg-rose" />
              Keunggulan
            </span>
            <h2 className="font-heading text-text-heading text-3xl md:text-4xl">
              Kenapa Memilih{' '}
              <span className="italic text-gradient">Velours</span>?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Truck size={24} />, title: 'Pengiriman Cepat', desc: 'Dikirim langsung setelah dipanggang. Packing aman & higienis.' },
              { icon: <ShoppingBag size={24} />, title: 'Mudah Dipesan', desc: 'Pesan dari website, tracking real-time. Praktis tanpa ribet.' },
              { icon: <Clock size={24} />, title: 'Fresh Daily', desc: 'Kami panggang setiap hari. Tidak ada stok kemarin.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-bg-card border border-border rounded-[4px] p-8 text-center card-hover"
              >
                <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-rose/10 flex items-center justify-center text-rose">
                  {item.icon}
                </div>
                <h3 className="font-heading text-text-heading text-base uppercase tracking-[2px] mb-2">{item.title}</h3>
                <p className="text-[12px] text-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG PREVIEW ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-[0.5px] bg-rose" />
                Blog
              </span>
              <h2 className="font-heading text-text-heading text-3xl md:text-4xl">
                Cerita &{' '}
                <span className="italic text-gradient">Tips</span>
              </h2>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-rose hover:text-text-rose transition-colors">
              Semua Artikel <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link href={article.href} className="group block card-hover">
                  <article className="bg-bg-card border border-border rounded-[4px] overflow-hidden h-full">
                    <div className="relative aspect-[16/10] bg-gradient-to-br from-bg-card to-[#1a0f0a] overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center text-rose/30">
                        <Heart size={32} />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-text-heading text-sm leading-snug group-hover:text-text-rose transition-colors">
                        {article.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:hidden"
          >
            <Link href="/blog">
              <Button variant="outline">Semua Artikel</Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIAL / NUMBERS ── */}
      <section className="py-16 md:py-20 bg-bg-section border-y-[0.5px] border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '5000+', label: 'Happy Customers' },
              { number: '30+', label: 'Varian Brownies' },
              { number: '4.9', label: 'Rating Rata-rata' },
              { number: '15+', label: 'Kota Terjangkau' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-heading text-text-rose text-3xl md:text-4xl mb-1">{stat.number}</p>
                <p className="text-[10px] uppercase tracking-[2px] text-text-muted">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-[0.5px] bg-rose" />
              Siap Mencicipi?
            </span>
            <h2 className="font-heading text-text-heading text-3xl md:text-5xl leading-[1.15] mb-4">
              Pesan Sekarang dan{' '}
              <span className="italic text-gradient">Rasakan</span>{' '}
              Perbedaannya
            </h2>
            <p className="text-[13px] text-text-muted max-w-lg mx-auto mb-8">
              Gratis ongkir untuk pembelian minimal Rp 200.000. Kami siap antar ke kotamu!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/products">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="primary" size="lg" className="group">
                    Pesan Sekarang
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">Hubungi Kami</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
