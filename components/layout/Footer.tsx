import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t-[0.5px] border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-text-heading text-lg uppercase tracking-[3px] mb-3 block">
              Velours
            </Link>
            <p className="text-[11px] text-text-muted leading-relaxed max-w-xs">
              Artisan brownies crafted daily with love and the finest ingredients. Setiap gigitan adalah kebahagiaan.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-3">Jelajahi</h4>
            <ul className="space-y-2 text-[12px] text-text-body">
              <li><Link href="/" className="hover:text-text-rose transition-colors">Beranda</Link></li>
              <li><Link href="/products" className="hover:text-text-rose transition-colors">Menu</Link></li>
              <li><Link href="/about" className="hover:text-text-rose transition-colors">Tentang</Link></li>
              <li><Link href="/blog" className="hover:text-text-rose transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-text-rose transition-colors">Kontak</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-3">Pelanggan</h4>
            <ul className="space-y-2 text-[12px] text-text-body">
              <li><Link href="/cart" className="hover:text-text-rose transition-colors">Keranjang</Link></li>
              <li><Link href="/orders" className="hover:text-text-rose transition-colors">Pesanan Saya</Link></li>
              <li><Link href="/profile" className="hover:text-text-rose transition-colors">Profil</Link></li>
              <li><Link href="/login" className="hover:text-text-rose transition-colors">Masuk</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] uppercase tracking-[2px] text-text-muted mb-3">Kontak</h4>
            <ul className="space-y-2 text-[12px] text-text-body">
              <li>hello@velours.com</li>
              <li>@velours.brownies</li>
              <li>+62 812 3456 7890</li>
              <li>Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t-[0.5px] border-white/10 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-text-muted">&copy; {new Date().getFullYear()} Velours Brownies. All rights reserved.</p>
          <div className="flex gap-4 text-[10px] text-text-muted">
            <span>Instagram</span>
            <span>TikTok</span>
            <span>WhatsApp</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
