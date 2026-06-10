'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Award, Leaf, Heart, ChefHat } from 'lucide-react'

const values = [
  { icon: <ChefHat size={18} />, title: 'Artisan Craft', desc: 'Setiap brownies dibuat tangan dengan resep turun-temurun yang disempurnakan selama bertahun-tahun.' },
  { icon: <Leaf size={18} />, title: 'Bahan Premium', desc: 'Kami hanya menggunakan cokelat Belgia, mentega Eropa, dan telur free-range untuk kualitas terbaik.' },
  { icon: <Heart size={18} />, title: 'Dibuat dengan Cinta', desc: 'Setiap batch dipanggang dengan penuh perhatian. Kami percaya rasa cinta itu nyata.' },
  { icon: <Award size={18} />, title: 'Konsistensi', desc: 'Rasa yang sama setiap kali Anda memesan — itulah standar yang kami jaga.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center mb-24"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-6"
            >
              <span className="w-6 h-[0.5px] bg-rose" />
              Our Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-heading text-text-heading text-4xl md:text-5xl leading-[1.15] mb-6"
            >
              Cerita di Balik{' '}
              <span className="italic text-gradient">Setiap Gigitan</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[13px] text-text-body leading-relaxed mb-4"
            >
              Berawal dari dapur kecil di tahun 2020, Velours lahir dari hasrat untuk menciptakan brownies
              yang bukan sekadar kue — tetapi pengalaman. Setiap resep diuji puluhan kali hingga menemukan
              keseimbangan sempurna antara fudgy dan chewy.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-[13px] text-text-muted leading-relaxed"
            >
              Kini kami hadir dengan misi sederhana: menyebarkan kebahagiaan melalui brownies.
              Dari Jakarta ke seluruh Indonesia, setiap kotak Velours adalah bukti bahwa kebaikan
              tidak perlu rumit — hanya butuh bahan terbaik dan hati yang tulus.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative overflow-hidden rounded-[4px] flex items-center justify-center bg-gradient-to-br from-bg-card to-bg-primary"
          >
            <Image
              src="/about-story.jpg"
              alt="Our kitchen"
              width={736}
              height={851}
              className="object-contain w-full h-auto max-h-[75vh]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/40 to-transparent pointer-events-none" />
          </motion.div>
        </motion.div>

        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-[10px] uppercase tracking-[3px] text-text-muted inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-[0.5px] bg-rose" />
              Core Values
            </span>
            <h2 className="font-heading text-text-heading text-3xl md:text-4xl">
              Apa yang Membuat Kami{' '}
              <span className="italic text-gradient">Berbeda</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card-hover p-6 bg-bg-card border border-border rounded-[4px]"
              >
                <div className="text-rose mb-4">{v.icon}</div>
                <h3 className="font-heading text-text-heading text-sm uppercase tracking-[2px] mb-2">{v.title}</h3>
                <p className="text-[11px] text-text-muted leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-bg-card border border-border rounded-[4px] p-12 md:p-16"
        >
          <h2 className="font-heading text-text-heading text-2xl md:text-3xl mb-4">
            Siap Mencicipi{' '}
            <span className="italic text-gradient">Velours</span>?
          </h2>
          <p className="text-[12px] text-text-body max-w-lg mx-auto mb-6">
            Pesan sekarang dan rasakan sendiri kenapa semua orang jatuh cinta pada gigitan pertama.
          </p>
          <a href="/products">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-rose text-white text-[11px] uppercase tracking-[2px] px-8 py-3 rounded-[2px] hover:bg-rose/80 transition-colors"
            >
              Pesan Sekarang
            </motion.button>
          </a>
        </motion.div>
      </section>
    </main>
  )
}
