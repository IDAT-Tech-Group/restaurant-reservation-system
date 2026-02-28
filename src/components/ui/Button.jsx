import { cx } from '../../lib/cx.js'

const BASE = 'inline-flex items-center gap-2 font-bold rounded-pill border-0 cursor-pointer transition-all duration-200 whitespace-nowrap select-none'

const VARIANTS = {
  gold:    'bg-gold text-ink hover:bg-gold-dark',
  dark:    'bg-ink text-white hover:bg-ink-soft dark:bg-dark-surface2 dark:text-white dark:hover:bg-dark-border',
  ghost:   'bg-bg text-ink-soft hover:bg-border-col hover:text-ink dark:bg-dark-surface dark:text-ink-ghost dark:hover:bg-dark-border dark:hover:text-white',
  danger:  'bg-red-100 text-red-700 hover:bg-red-600 hover:text-white dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white',
  outline: 'bg-transparent text-ink border-2 border-border-col hover:border-ink hover:bg-white dark:text-white dark:border-dark-border dark:hover:border-white dark:hover:bg-dark-surface',
  primary: 'bg-ink text-white hover:bg-ink-soft shadow-md2 hover:shadow-lg2 hover:-translate-y-0.5 dark:bg-dark-surface2 dark:hover:bg-dark-border',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function Button({ as: Tag = 'button', variant = 'gold', size = 'md', children, onClick, type = 'button', href, className, disabled }) {
  const isButton = Tag === 'button'
  return (
    <Tag
      {...(isButton ? { type, disabled } : { href })}
      onClick={onClick}
      className={cx(BASE, VARIANTS[variant], SIZES[size], disabled && 'opacity-50 cursor-not-allowed', 'no-underline', className)}
    >
      {children}
    </Tag>
  )
}
