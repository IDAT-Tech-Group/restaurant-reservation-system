import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { useDarkMode } from '../../hooks/useDarkMode.jsx'
import { AuthContext } from '../../context/AuthContext.jsx'

const ROUTE_LANDING = '/'

export default function Topbar() {
  const { isDark, toggle } = useDarkMode()
  const navigate = useNavigate()
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="sticky py-4 top-0 z-50 h-17 flex items-center justify-between px-10 bg-surface dark:bg-dark-surface border-b border-border-col dark:border-dark-border">
      <div className="flex items-center gap-2.5 font-black text-xl text-ink dark:text-white tracking-tight">
        <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center text-xl">🍽️</div>
        ReservaFácil
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTE_LANDING)}
          className="text-sm font-semibold text-ink-soft dark:text-ink-ghost hover:text-ink dark:hover:text-white transition-colors bg-transparent border-0 cursor-pointer px-3 py-2 rounded-xl hover:bg-bg dark:hover:bg-dark-bg"
        >
          ← Landing
        </button>
        <button
          onClick={toggle}
          title={isDark ? 'Modo claro' : 'Modo oscuro'}
          className="w-10 h-10 rounded-xl bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border flex items-center justify-center text-xl cursor-pointer hover:bg-gold hover:border-gold transition-all hover:rotate-12 duration-200"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center gap-2 ml-2">
          {user && (
            <span className="text-sm font-medium text-ink dark:text-white hidden md:block">
              {user.name}
            </span>
          )}
          <button 
            onClick={logout}
            title="Cerrar sesión"
            className="w-10 h-10 rounded-full bg-ink dark:bg-dark-surface2 text-white flex items-center justify-center font-black text-sm cursor-pointer hover:bg-red-500 transition-colors"
          >
            {user?.avatar || 'A'}
          </button>
        </div>
      </div>
    </header>
  )
}
