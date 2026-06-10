'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full bg-bg-primary border border-border/80 text-text-heading placeholder-text-muted focus:outline-none focus:border-rose focus:ring-1 focus:ring-rose/20 rounded-[2px] px-3 py-2 text-[13px] transition-all duration-300',
          className,
        )}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
