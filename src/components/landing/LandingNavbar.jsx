import Button from '../ui/Button.jsx'

export default function LandingNavbar() {
  return (
    <nav className="fixed py-4 top-0 left-0 right-0 z-50 h-17 flex items-center justify-between px-10 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-border-col dark:border-dark-border">
      <a href="#" className="flex items-center gap-2.5 font-black text-xl text-ink dark:text-white no-underline tracking-tight">
        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-xl">🍽️</div>
        La Bella Tavola
      </a>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {[['nosotros', 'Nosotros'], ['menu', 'Menú'], ['horarios', 'Horarios']].map(([id, label]) => (
          <li key={id}>
            <a href={`#${id}`} className="text-sm font-semibold text-ink-soft dark:text-ink-ghost hover:text-ink dark:hover:text-white transition-colors no-underline">
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        <Button as="a" variant="gold" size="sm" href="#reservar">
          🗓️ Reservar mesa
        </Button>
      </div>
    </nav>
  )
}
