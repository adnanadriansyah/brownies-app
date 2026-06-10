'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'dark' | 'light'
type ThemeContextType = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeContextType>({ theme: 'dark', toggle: () => {} })
export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('velours-theme') as Theme | null
    if (stored) {
      setTheme(stored)
      document.documentElement.setAttribute('data-theme', stored)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('velours-theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
