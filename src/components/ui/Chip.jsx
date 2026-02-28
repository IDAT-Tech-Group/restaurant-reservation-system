import { cx } from '../../lib/cx.js'

const VARIANTS = {
  default: 'bg-bg text-ink border border-transparent hover:border-gold hover:bg-yellow-50 dark:bg-dark-surface dark:text-white dark:hover:border-gold',
  gold:    'bg-gold text-ink border border-gold',
  dark:    'bg-ink text-white border border-ink dark:bg-dark-surface2 dark:border-dark-border',
}

export default function Chip({ variant = 'default', children, onClick }) {
  return (
    <span
      onClick={onClick}
      className={cx('inline-block rounded-pill px-4 py-2 text-sm font-semibold cursor-pointer transition-all duration-200', VARIANTS[variant])}
    >
      {children}
    </span>
  )
}
