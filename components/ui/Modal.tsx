'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'relative bg-bg-card border border-border/80 rounded-[8px] p-6 w-full max-w-md max-h-[90vh] overflow-y-auto',
              className,
            )}
          >
            <div className="flex items-center justify-between mb-4">
              {title && (
                <h2 className="font-heading text-text-heading text-lg">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="text-text-muted hover:text-text-heading ml-auto transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
