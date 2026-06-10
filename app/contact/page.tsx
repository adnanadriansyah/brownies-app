'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react'

const contactInfo = [
  { icon: <MapPin size={14} />, label: 'Alamat', value: 'Jl. Brownies Indah No. 42, Jakarta Selatan' },
  { icon: <Phone size={14} />, label: 'Telepon', value: '+62 812 3456 7890' },
  { icon: <Mail size={14} />, label: 'Email', value: 'hello@velours.com' },
  { icon: <Clock size={14} />, label: 'Jam Operasional', value: 'Sen–Sab, 08:00 – 20:00' },
]

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

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
            Get in Touch
          </span>
          <h1 className="font-heading text-text-heading text-4xl md:text-5xl leading-[1.15]">
            Hubungi{' '}
            <span className="italic text-gradient">Kami</span>
          </h1>
          <p className="text-[13px] text-text-body max-w-lg mx-auto mt-4">
            Punya pertanyaan, saran, atau mau pesan dalam jumlah besar? Kami siap membantu.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-text-muted">{item.label}</p>
                  <p className="text-[13px] text-text-heading">{item.value}</p>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-6 border-t border-white/10"
            >
              <p className="text-[10px] uppercase tracking-[2px] text-text-muted mb-2">Ikuti Kami</p>
              <div className="flex gap-3 text-[11px] text-text-body">
                <a href="#" className="hover:text-text-rose transition-colors">Instagram</a>
                <a href="#" className="hover:text-text-rose transition-colors">TikTok</a>
                <a href="#" className="hover:text-text-rose transition-colors">WhatsApp</a>
              </div>
            </motion.div>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-3 bg-bg-card border border-border rounded-[4px] p-8 space-y-5"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[2px] text-text-muted block mb-2">Nama</label>
                <input
                  required
                  className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-4 py-2.5 text-[13px] transition-all"
                  placeholder="Nama kamu"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[2px] text-text-muted block mb-2">Email</label>
                <input
                  required
                  type="email"
                  className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-4 py-2.5 text-[13px] transition-all"
                  placeholder="email@kamu.com"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[2px] text-text-muted block mb-2">Subjek</label>
              <input
                required
                className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-4 py-2.5 text-[13px] transition-all"
                placeholder="Ada yang bisa kami bantu?"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[2px] text-text-muted block mb-2">Pesan</label>
              <textarea
                required
                rows={5}
                className="w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose rounded-[2px] px-4 py-2.5 text-[13px] transition-all resize-none"
                placeholder="Tulis pesan kamu di sini..."
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-rose text-white text-[11px] uppercase tracking-[2px] px-8 py-3 rounded-[2px] hover:bg-rose/80 transition-colors flex items-center justify-center gap-2"
            >
              {sent ? (
                <>Terkirim! Kami akan membalas dalam 1x24 jam</>
              ) : (
                <><Send size={12} /> Kirim Pesan</>
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </main>
  )
}
