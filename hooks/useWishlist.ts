'use client'

import { create } from 'zustand'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

interface WishlistProduct {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  imageUrl: string | null
  rating: number
  reviewCount: number
  isActive: boolean
  category: { id: string; name: string }
}

interface WishlistItem {
  id: string
  productId: string
  product: WishlistProduct
  createdAt: string
}

interface WishlistStore {
  items: WishlistItem[]
  loading: boolean
  productIds: Set<string>
  fetchWishlist: () => Promise<void>
  addItem: (productId: string) => Promise<boolean>
  removeItem: (productId: string) => Promise<boolean>
  isWishlisted: (productId: string) => boolean
  toggleItem: (productId: string) => Promise<boolean>
}

export const useWishlist = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,
  productIds: new Set(),

  fetchWishlist: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/wishlist')
      if (res.ok) {
        const items: WishlistItem[] = await res.json()
        set({ items, productIds: new Set(items.map((i) => i.productId)), loading: false })
      } else {
        set({ loading: false })
      }
    } catch {
      set({ loading: false })
    }
  },

  addItem: async (productId: string) => {
    const res = await fetch('/api/wishlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    })
    if (res.ok) {
      const item = await res.json()
      if (item.id) {
        set((state) => ({
          items: [item, ...state.items],
          productIds: new Set([...state.productIds, productId]),
        }))
      }
      return true
    }
    return false
  },

  removeItem: async (productId: string) => {
    const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' })
    if (res.ok) {
      set((state) => {
        const newIds = new Set(state.productIds)
        newIds.delete(productId)
        return {
          items: state.items.filter((i) => i.productId !== productId),
          productIds: newIds,
        }
      })
      return true
    }
    return false
  },

  isWishlisted: (productId: string) => {
    return get().productIds.has(productId)
  },

  toggleItem: async (productId: string) => {
    if (get().isWishlisted(productId)) {
      await get().removeItem(productId)
      return false
    } else {
      await get().addItem(productId)
      return true
    }
  },
}))

export function useSyncWishlist() {
  const { data: session } = useSession()
  const fetchWishlist = useWishlist((s) => s.fetchWishlist)

  useEffect(() => {
    if (session?.user?.id) {
      fetchWishlist()
    } else {
      useWishlist.setState({ items: [], productIds: new Set() })
    }
  }, [session?.user?.id, fetchWishlist])
}
