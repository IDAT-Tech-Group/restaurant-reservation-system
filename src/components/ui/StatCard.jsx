import { cx } from '../../lib/cx.js'

const VARIANTS = {
  default: 'bg-surface dark:bg-dark-surface',
  accent:  'bg-gold',
  dark:    'bg-ink dark:bg-dark-surface2',
}

const EMOJI_BG = {
  default: 'bg-bg dark:bg-dark-bg',
  accent:  'bg-white/35',
  dark:    'bg-white/10',
}

const LABEL_COLOR = {
  default: 'text-ink-soft dark:text-ink-ghost',
  accent:  'text-ink/70',
  dark:    'text-white/60',
}

const VALUE_COLOR = {
  default: 'text-ink dark:text-white',
  accent:  'text-ink',
  dark:    'text-white',
}

export default function StatCard({ emoji, label, value, variant = 'default' }) {
  return (
    <div className={cx('flex flex-col gap-2 rounded-xl2 p-6 shadow-sm2', VARIANTS[variant])}>
      <div className={cx('w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-1', EMOJI_BG[variant])}>
        {emoji}
      </div>
      <span className={cx('text-xs font-bold uppercase tracking-wider', LABEL_COLOR[variant])}>{label}</span>
      <span className={cx('text-4xl font-black tracking-tight leading-none', VALUE_COLOR[variant])}>{value}</span>
    </div>
  )
}
