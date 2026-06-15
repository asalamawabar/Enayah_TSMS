import type { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'warning' | 'ghost'
  size?: 'sm' | 'md'
  icon?: ReactNode
  children?: ReactNode
}

const styles: Record<string, string> = {
  default:  'border border-[var(--border)] bg-[var(--card)] text-[var(--text2)] hover:bg-[var(--bg)]',
  primary:  'border border-primary bg-primary text-white hover:bg-primary-mid',
  danger:   'border border-danger bg-danger text-white',
  warning:  'border border-warning bg-warning text-white',
  ghost:    'border border-transparent text-[var(--g)] hover:bg-[var(--gl)]',
}

export function Button({ variant = 'default', size = 'md', icon, children, className, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg font-tajawal transition-colors cursor-pointer disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-[12px]',
        styles[variant],
        className
      )}
    >
      {icon}{children}
    </button>
  )
}
