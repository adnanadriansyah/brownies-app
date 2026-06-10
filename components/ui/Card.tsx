'use client'

import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'card-hover bg-bg-card border-[0.5px] border-border rounded-[4px]',
          className,
        )}
        {...props}
      />
    )
  },
)
Card.displayName = 'Card'

export { Card }
