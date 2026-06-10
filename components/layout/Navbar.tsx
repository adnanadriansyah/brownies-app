'use client'

import Link from 'next/link'
import { Search, ShoppingBag, User, LogOut, Menu, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Navbar() {
  const { data: session } = useSession()
  const totalItems = useCart((s) => s.totalItems())
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass border-b-[0.5px] border-border'
          : 'bg-bg-primary'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-heading text-text-heading uppercase tracking-[3px] text-xl hover:text-text-heading transition-colors duration-300"
        >
          Velours
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[2px] text-text-body">
          <Link
            href="/"
            className="relative hover:text-text-rose transition-colors duration-300 group"
          >
            Beranda
            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/products"
            className="relative hover:text-text-rose transition-colors duration-300 group"
          >
            Menu
            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/about"
            className="relative hover:text-text-rose transition-colors duration-300 group"
          >
            Tentang
            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/blog"
            className="relative hover:text-text-rose transition-colors duration-300 group"
          >
            Blog
            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link
            href="/contact"
            className="relative hover:text-text-rose transition-colors duration-300 group"
          >
            Kontak
            <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
          </Link>
          {session && (
            <Link
              href="/orders"
              className="relative hover:text-text-rose transition-colors duration-300 group"
            >
              Pesanan Saya
              <span className="absolute -bottom-1 left-0 w-0 h-[0.5px] bg-rose transition-all duration-300 group-hover:w-full" />
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-text-body hover:text-text-rose transition-colors duration-200"
          >
            <Search size={16} />
          </motion.button>

          <Link href="/cart" className="relative text-text-body hover:text-text-rose transition-colors duration-200">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ShoppingBag size={16} />
            </motion.div>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 bg-rose text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-mono"
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {session ? (
            <div className="relative group hidden md:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-7 h-7 rounded-full bg-rose text-white text-[10px] font-medium flex items-center justify-center cursor-pointer"
              >
                {session.user?.name?.charAt(0) || 'U'}
              </motion.button>
              <div className="absolute right-0 top-full mt-2 w-44 bg-bg-primary/95 backdrop-blur-xl border border-border/80 rounded-[4px] py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-[11px] text-text-body hover:text-text-heading hover:bg-white/[0.04] transition-colors"
                >
                  Profil
                </Link>
                {session.user?.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-[11px] text-text-body hover:text-text-heading hover:bg-white/[0.04] transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-4 py-2 text-[11px] text-text-body hover:text-danger hover:bg-white/[0.04] transition-colors"
                >
                  <LogOut size={10} /> Keluar
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <User size={16} className="text-text-body hover:text-text-rose transition-colors duration-200" />
              </motion.div>
            </Link>
          )}

          <button
            className="md:hidden text-text-body hover:text-text-rose transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
                  className="border-t-[0.5px] border-white/10 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Cari brownies..."
                  autoFocus
                  className="w-full bg-bg-card border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-[#c47a8a] rounded-[2px] pl-9 pr-4 py-2 text-[13px] transition-all duration-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const q = (e.target as HTMLInputElement).value
                      window.location.href = `/products?search=${encodeURIComponent(q)}`
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t-[0.5px] border-[rgba(200,140,110,0.1)] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Beranda</Link>
              <Link href="/products" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Menu</Link>
              <Link href="/about" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Tentang</Link>
              <Link href="/blog" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link href="/contact" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Kontak</Link>
              {session && (
                <Link href="/orders" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Pesanan Saya</Link>
              )}
              {session ? (
                <>
                  <Link href="/profile" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Profil</Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block text-[12px] uppercase tracking-[2px] text-text-body hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Admin</Link>
                  )}
                  <button onClick={() => signOut()} className="block text-[12px] uppercase tracking-[2px] text-danger hover:text-danger/80 transition-colors">Keluar</button>
                </>
              ) : (
                <Link href="/login" className="block text-[12px] uppercase tracking-[2px] text-rose hover:text-text-rose transition-colors" onClick={() => setMobileOpen(false)}>Masuk</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
