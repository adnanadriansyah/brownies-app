'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Trash2, MapPin, LogOut, User, Edit } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { AnimatedSection, StaggerGrid, StaggerItem } from '@/components/ui/AnimatedSection'

interface Address {
  id: string
  label: string
  street: string
  city: string
  province: string
  postalCode: string
  isDefault: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Address | null>(null)
  const [label, setLabel] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [province, setProvince] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    if (!session) { router.push('/login'); return }
    fetchAddresses()
  }, [session, router])

  function fetchAddresses() {
    fetch('/api/addresses').then((r) => r.json()).then(setAddresses).catch(() => {})
  }

  function openAdd() {
    setEditing(null); setLabel(''); setStreet(''); setCity('')
    setProvince(''); setPostalCode(''); setIsDefault(false); setShowModal(true)
  }

  function openEdit(addr: Address) {
    setEditing(addr); setLabel(addr.label); setStreet(addr.street)
    setCity(addr.city); setProvince(addr.province); setPostalCode(addr.postalCode); setIsDefault(addr.isDefault); setShowModal(true)
  }

  async function handleSubmit() {
    const body = { label, street, city, province, postalCode, isDefault }
    if (editing) {
      await fetch(`/api/addresses/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch('/api/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setShowModal(false); fetchAddresses()
  }

  async function setAsDefault(id: string) {
    await fetch(`/api/addresses/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDefault: true }) })
    fetchAddresses()
  }

  async function deleteAddress(id: string) {
    await fetch(`/api/addresses/${id}`, { method: 'DELETE' }); fetchAddresses()
  }

  if (!session) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-[280px_1fr] gap-8 items-start">
      <AnimatedSection className="md:sticky md:top-24">
        <div className="bg-bg-section p-6 text-center border-[0.5px] border-white/10 rounded-[4px]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-rose to-[#e8a0b0] flex items-center justify-center text-white text-[26px] font-medium mx-auto mb-4"
          >
            {session.user?.name?.charAt(0) || 'U'}
          </motion.div>
          <h2 className="font-heading text-[#f0e0d6] text-[20px]">{session.user?.name}</h2>
          <p className="text-[11px] text-[#705050] mt-1">{session.user?.email}</p>
          <div className="mt-3">
            <span className={`text-[8px] uppercase tracking-[1.5px] px-2.5 py-1 rounded-[1px] ${
              session.user?.role === 'ADMIN'
                ? 'bg-[rgba(196,122,138,0.2)] text-[#e8a0b0]'
                : 'bg-[rgba(160,128,112,0.15)] text-[#a08070]'
            }`}>
              {session.user?.role === 'ADMIN' ? 'Admin' : 'Customer'}
            </span>
          </div>
          <div className="mt-6 space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              <Edit size={10} /> Edit Profil
            </Button>
            <Button variant="outline" size="sm" className="w-full text-[#f09595] border-[#f09595]/30 hover:bg-[#f09595]/10" onClick={() => signOut()}>
              <LogOut size={10} /> Keluar
            </Button>
          </div>
        </div>
      </AnimatedSection>

      <div>
        <AnimatedSection delay={0.1}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-[#f0e0d6] text-xl">Alamat Tersimpan</h2>
              <p className="text-[10px] text-[#705050] mt-1">{addresses.length} alamat</p>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button size="sm" onClick={openAdd}>
                + Tambah Alamat
              </Button>
            </motion.div>
          </div>
        </AnimatedSection>

        {addresses.length === 0 ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#705050] text-[12px] text-center py-8">
            Belum ada alamat tersimpan
          </motion.p>
        ) : (
          <StaggerGrid className="space-y-3">
            {addresses.map((addr) => (
              <StaggerItem key={addr.id}>
                <Card className="p-4 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[14px] text-[#f0e0d6] font-medium">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[8px] uppercase tracking-[1px] bg-[rgba(196,122,138,0.2)] text-[#e8a0b0] px-2 py-0.5 rounded-[1px]">Default</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#a08070]">{addr.street}, {addr.city}, {addr.province} {addr.postalCode}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {!addr.isDefault && (
                        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setAsDefault(addr.id)}
                          className="text-[8px] uppercase tracking-[1.5px] text-[#c47a8a] border-[0.5px] border-[#c47a8a] px-2 py-1 rounded-[1px] hover:bg-[#c47a8a]/10 transition-all duration-200"
                        >
                          Jadikan Default
                        </motion.button>
                      )}
                      <motion.button whileHover={{ scale: 1.1 }} onClick={() => openEdit(addr)}
                        className="text-[#a08070] hover:text-[#f0e0d6] transition-colors p-1"
                      >
                        <Edit size={11} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }}
                        onClick={() => deleteAddress(addr.id)}
                        disabled={addresses.length === 1}
                        className="text-[#4a2218] hover:text-[#f09595] transition-colors disabled:opacity-30 p-1"
                      >
                        <Trash2 size={11} />
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Alamat' : 'Tambah Alamat'}>
        <div className="space-y-4">
          {[
            { key: 'label', label: 'Label', placeholder: 'Rumah / Kantor', value: label, set: setLabel },
            { key: 'street', label: 'Jalan', placeholder: 'Nama jalan', value: street, set: setStreet },
            { key: 'city', label: 'Kota', placeholder: 'Kota', value: city, set: setCity },
            { key: 'province', label: 'Provinsi', placeholder: 'Provinsi', value: province, set: setProvince },
            { key: 'postalCode', label: 'Kode Pos', placeholder: '12345', value: postalCode, set: setPostalCode },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[9px] uppercase tracking-[1.5px] text-[#705050] block mb-1">{f.label}</label>
              <Input placeholder={f.placeholder} value={f.value} onChange={(e) => f.set(e.target.value)} />
            </div>
          ))}
          <label className="flex items-center gap-2 text-[11px] text-[#a08070] cursor-pointer">
            <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="accent-[#c47a8a]" />
            Jadikan default
          </label>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button size="sm" className="w-full" onClick={handleSubmit}>Simpan</Button>
          </motion.div>
        </div>
      </Modal>
    </div>
  )
}
