import Button from '../ui/Button.jsx'
import { useAuth } from "../../context/AuthContext"
import { Link } from 'react-router-dom'

export default function LandingNavbar() {

  const { user, logout } = useAuth()

  return (
    <nav className="fixed py-4 top-0 left-0 right-0 z-50 h-17 flex items-center justify-between px-10 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-border-col dark:border-dark-border">
      <Link to="/" className="flex items-center gap-2.5 font-black text-xl text-ink dark:text-white no-underline tracking-tight">
        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-xl">🍽️</div>
        La Bella Tavola
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {[['nosotros', 'Nosotros'], ['menu', 'Menú'], ['horarios', 'Horarios']].map(([id, label]) => (
          <li key={id}>
            <Link to={`/#${id}`} className="text-sm font-semibold text-ink-soft dark:text-ink-ghost hover:text-ink dark:hover:text-white transition-colors no-underline">
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">

        {!user && (
          <Link to="/login">
            <Button variant="outline" size="sm">
              Iniciar sesión
            </Button>
          </Link>
        )}

        {user && (
          <>
            <Link to="/my-reservations">
              <Button variant="outline" size="sm" className="mr-2">
                📅 Mis reservas
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </>
        )}

        <Link to="/#reservar">
          <Button variant="gold" size="sm">
            🗓️ Reservar mesa
          </Button>
        </Link>

      </div>
    </nav>
  )
}
