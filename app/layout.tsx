import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from './providers'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-heading',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Velours Brownies',
  description: 'Artisan brownies crafted daily',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-body bg-[#1a0f0a] text-[#a08070] antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
