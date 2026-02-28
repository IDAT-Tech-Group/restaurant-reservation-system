import { cx } from '../../lib/cx.js'

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard' },
  { id: 'calendar',     icon: '📅', label: 'Calendario' },
  { id: 'reservations', icon: '📋', label: 'Reservas' },
]
const SETTINGS_ITEMS = [
  { id: 'settings', icon: '⚙️', label: 'Configuración' },
]

export default function Sidebar({ activeView, onNavigate }) {
  const Item = ({ id, icon, label }) => (
    <button
      onClick={() => onNavigate(id)}
      className={cx(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 border-0 cursor-pointer text-left',
        activeView === id
          ? 'bg-gold text-ink font-black'
          : 'text-ink-soft dark:text-ink-ghost hover:bg-bg dark:hover:bg-dark-bg hover:text-ink dark:hover:text-white bg-transparent'
      )}
    >
      <span className="text-lg w-5 text-center">{icon}</span>
      {label}
    </button>
  )

  return (
    <aside className="hidden md:flex w-56 flex-col gap-1 bg-surface dark:bg-dark-surface border-r border-border-col dark:border-dark-border p-4 shrink-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-ink-ghost px-2 mb-1">Menú</span>
      {NAV_ITEMS.map(item => <Item key={item.id} {...item} />)}
      <span className="text-[10px] font-black uppercase tracking-widest text-ink-ghost px-2 mt-4 mb-1">Sistema</span>
      {SETTINGS_ITEMS.map(item => <Item key={item.id} {...item} />)}
    </aside>
  )
}
