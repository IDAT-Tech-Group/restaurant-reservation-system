import { cx } from '../../lib/cx.js'

const VARIANTS = {
  green: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  amber: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  red:   'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  gray:  'bg-border-col text-ink-soft dark:bg-dark-border dark:text-ink-ghost',
}

export default function Badge({ variant = 'green', children }) {
  return (
    <span className={cx('inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-bold tracking-wide', VARIANTS[variant])}>
      {children}
    </span>
  )
}
