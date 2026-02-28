import { cx } from '../../lib/cx.js'

const ITEMS = [
  { id: 'dashboard',    icon: '📊', label: 'Inicio' },
  { id: 'calendar',     icon: '📅', label: 'Calendario' },
  { id: 'reservations', icon: '📋', label: 'Reservas' },
  { id: 'settings',     icon: '⚙️', label: 'Config.' },
]

export default function MobileNav({ activeView, onNavigate }) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-surface dark:bg-dark-surface border-t border-border-col dark:border-dark-border px-4 py-2">
      {ITEMS.map(({ id, icon, label }) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className={cx(
            'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-black cursor-pointer border-0 transition-all',
            activeView === id ? 'bg-gold text-ink' : 'text-ink-ghost bg-transparent hover:text-ink dark:hover:text-white'
          )}
        >
          <span className="text-xl">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  )
}
