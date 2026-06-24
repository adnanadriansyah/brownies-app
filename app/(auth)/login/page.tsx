'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Email atau password salah')
      return
    }

    const session = await getSession()
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin')
    } else {
      router.push('/')
    }
    router.refresh()
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-[420px] bg-bg-card border border-border/80 rounded-[8px] p-10">
        <div className="text-center mb-8">
          <h1 className="font-heading text-text-heading text-2xl uppercase tracking-[4px] mb-2">
            Velours
          </h1>
          <p className="text-[12px] text-text-muted">Masuk ke akun kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-[1.5px] text-text-muted block mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[1.5px] text-text-muted block mb-2">
              Password
            </label>
            <div className="relative">
              <Input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body"
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-danger">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>

        <p className="mt-6 text-[11px] text-center text-text-muted">
          Belum punya akun?{' '}
          <Link href="/register" className="text-rose hover:text-text-rose">
            Daftar &rarr;
          </Link>
        </p>
      </div>
    </div>
  )
}
