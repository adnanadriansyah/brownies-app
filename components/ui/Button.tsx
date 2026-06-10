'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary:
    'btn-shine bg-rose text-white hover:bg-rose-hover uppercase tracking-widest text-[11px] rounded-[2px] transition-all duration-300 active:scale-[0.97]',
  outline:
    'border-[0.5px] border-rose text-rose bg-transparent hover:bg-rose/10 hover:text-text-rose hover:border-text-rose rounded-[2px] transition-all duration-300',
  ghost:
    'text-text-body hover:text-text-heading hover:bg-white/[0.04] rounded-[2px] transition-all duration-200',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[10px]',
  md: 'px-6 py-2.5 text-[11px]',
  lg: 'px-8 py-3 text-[12px]',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
