'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

const articles = [
  {
    slug: 'tips-menyimpan-brownies',
    title: 'Tips Menyimpan Brownies agar Tetap Fresh',
    excerpt: 'Brownies bisa bertahan hingga seminggu jika disimpan dengan benar. Simak tips berikut agar brownies kesayanganmu tetap lembut.',
    date: '5 Juni 2026',
    readTime: '3 menit',
    image: '/blog-brownies-1.jpg',
    category: 'Tips',
  },
  {
    slug: 'perbedaan-brownies-fudgy-cakey',
    title: 'Fudgy vs Cakey: Mana yang Cocok untukmu?',
    excerpt: 'Dua tekstur brownies yang paling populer. Yuk kenali perbedaan bahan dan cara membuatnya.',
    date: '28 Mei 2026',
    readTime: '5 menit',
    image: '/blog-brownies-2.jpg',
    category: 'Edukasi',
  },
  {
    slug: 'brownies-untuk-acara-spesial',
    title: '5 Ide Brownies untuk Acara Spesialmu',
    excerpt: 'Ulang tahun, anniversary, atau arisan? Ini dia rekomendasi paket brownies yang bikin momenmu makin manis.',
    date: '20 Mei 2026',
    readTime: '4 menit',
    image: '/blog-brownies-3.jpg',
    category: 'Inspirasi',
  },
  {
    slug: 'bahan-premium-brownies',
    title: 'Kenapa Bahan Premium Itu Penting?',
    excerpt: 'Kualitas bahan menentukan hasil akhir. Kami terbuka soal dari mana kami mendapatkan bahan-bahan terbaik.',
    date: '12 Mei 2026',
    readTime: '6 menit',
    image: '/blog-brownies-4.jpg',
    category: 'Behind the Scene',
  },
  {
    slug: 'cara-order-velours',
    title: 'Panduan Lengkap Order Brownies Velours',
    excerpt: 'Baru pertama order? Tenang, ini panduan lengkap dari memilih varian hingga melacak pengiriman.',
    date: '3 Mei 2026',
    readTime: '2 menit',
    image: '/blog-brownies-5.jpg',
    category: 'Panduan',
  },
  {
    slug: 'velours-x-kolaborasi',
    title: 'Velours x Local Brands: Kolaborasi Spesial',
    excerpt: 'Kami berkolaborasi dengan brand lokal favoritmu untuk menciptakan edisi terbatas yang sayang dilewatkan.',
    date: '25 April 2026',
    readTime: '3 menit',
    image: '/blog-brownies-6.jpg',
    category: 'Kolaborasi',
  },
]

const categories = ['Semua', 'Tips', 'Edukasi', 'Inspirasi', 'Behind the Scene', 'Panduan', 'Kolaborasi']

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-4">
            <span className="w-6 h-[0.5px] bg-rose" />
            Journal
          </span>
          <h1 className="font-heading text-text-heading text-4xl md:text-5xl leading-[1.15]">
            Blog{' '}
            <span className="italic text-gradient">Velours</span>
          </h1>
          <p className="text-[13px] text-text-body max-w-lg mx-auto mt-4">
            Cerita, tips, dan inspirasi seputar brownies dari dapur kami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              className={`text-[10px] uppercase tracking-[2px] px-4 py-2 rounded-[2px] border transition-all duration-300 ${
                cat === 'Semua'
                  ? 'bg-rose text-white border-[#c47a8a]'
                  : 'border-border/80 text-text-muted hover:text-text-heading hover:border-[#c47a8a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <StaggerItem key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="group block card-hover">
                <article className="bg-bg-card border border-border rounded-[4px] overflow-hidden h-full flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-bg-card to-bg-primary">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 to-transparent" />
                    <span className="absolute top-3 left-3 text-[9px] uppercase tracking-[2px] bg-bg-primary/80 text-rose px-2.5 py-1 rounded-[2px]">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-[9px] text-text-muted uppercase tracking-[2px] mb-2">
                      <span className="flex items-center gap-1"><Calendar size={10} /> {article.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                    </div>
                    <h3 className="font-heading text-text-heading text-base leading-snug mb-2 group-hover:text-text-rose transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[12px] text-text-muted leading-relaxed flex-1">{article.excerpt}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[2px] text-rose mt-4 group-hover:gap-2 transition-all">
                      Baca Selengkapnya <ArrowRight size={10} />
                    </span>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </main>
  )
}
