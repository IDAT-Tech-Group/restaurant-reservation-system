import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useReservations } from '../context/ReservationsContext'
import { getReservations } from '../services/reservationsService'
import { ZONES } from '../constants/reservations'
import { Link } from 'react-router-dom'

export default function MyReservations() {
  const { user } = useAuth()
  const { updateReservationStatus } = useReservations()
  const [myReservations, setMyReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setLoading(false); return }
    getReservations()
      .then(data => {
        const sorted = (Array.isArray(data) ? data : [])
          .sort((a, b) => new Date(`${a.date}T${a.startTime || '00:00'}`) - new Date(`${b.date}T${b.startTime || '00:00'}`))
        setMyReservations(sorted)
      })
      .catch(() => setMyReservations([]))
      .finally(() => setLoading(false))
  }, [user?.id])

  const upcomingReservations = myReservations.filter(r => new Date(`${r.date}T${r.startTime || r.time || '00:00'}`) >= new Date())
  const pastReservations = myReservations.filter(r => new Date(`${r.date}T${r.startTime || r.time || '00:00'}`) < new Date())

  if (!user) {
    return (
      <section className="bg-ink dark:bg-dark-bg min-h-screen py-32 px-8 flex items-center justify-center">
        <div className="bg-surface dark:bg-dark-surface p-10 rounded-xl2 text-center shadow-lg2 max-w-md">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-2xl font-black mb-2 dark:text-white">Acceso denegado</h2>
          <p className="text-ink-soft dark:text-ink-ghost mb-6">Inicia sesión para ver tus reservas.</p>
          <Link to="/" className="text-gold font-bold hover:underline">← Volver al inicio</Link>
        </div>
      </section>
    )
  }

  const renderReservationCard = (res) => {
    const d = new Date(`${res.date}T12:00:00`)
    const dateStr = d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const zoneName = ZONES.find(z => z.id === res.zone)?.name || 'General'

    return (
      <div key={res.id} className="bg-surface dark:bg-dark-surface p-6 rounded-xl border border-border-col dark:border-dark-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-gold/50 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-gold/20 text-gold-dark text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
              Mesa {res.table}
            </span>
            <span className="text-xs font-bold text-ink-ghost uppercase tracking-widest">
              {zoneName}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${res.status === 'completado' ? 'bg-green-100 text-green-700' : res.status === 'reservado' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
              {res.status}
            </span>
          </div>
          <h3 className="text-lg font-black text-ink dark:text-white capitalize mb-1">
            {dateStr}
          </h3>
          <p className="text-sm font-semibold text-ink-soft dark:text-ink-ghost">
            🕐 {res.startTime} - {res.endTime} • 👥 {res.persons} personas
          </p>
          {res.notes && (
            <p className="text-xs text-ink-ghost mt-2 border-t border-border-col pt-2 max-w-md">
              📝 {res.notes}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 w-full md:w-auto mt-2 md:mt-0 flex justify-end">
          {res.status === 'pendiente' && (
            <button
              onClick={() => updateReservationStatus(res.id, 'reservado')}
              className="px-4 py-2 bg-gold text-ink font-bold text-sm rounded-lg hover:bg-gold-dark transition-colors border-0 cursor-pointer shadow-sm w-full md:w-auto"
            >
              💳 Simular Pago (50%)
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="bg-ink dark:bg-dark-bg min-h-screen py-32 px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
          Mis Reservas
        </h1>
        <p className="text-white/60 mb-10">
          Hola {user.name}, aquí puedes ver tu historial y próximas reservas en La Bella Tavola.
        </p>

        {myReservations.length === 0 ? (
          <div className="bg-surface/10 border border-white/10 rounded-xl p-10 text-center">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-white mb-2">Aún no tienes reservas</h3>
            <p className="text-white/60 mb-6 max-w-sm mx-auto">
              No hemos encontrado ninguna reserva asociada a tu cuenta de correo ({user.username}).
            </p>
            <Link to="/#reservar" className="bg-gold text-ink font-bold px-6 py-3 rounded-xl hover:bg-gold-dark transition-colors inline-block">
              Hacer una reserva
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {upcomingReservations.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  Próximas Reservas
                </h2>
                <div className="flex flex-col gap-4">
                  {upcomingReservations.map(renderReservationCard)}
                </div>
              </div>
            )}

            {pastReservations.length > 0 && (
              <div>
                <h2 className="text-xl font-black text-white/50 mb-4">
                  Historial Pasado
                </h2>
                <div className="flex flex-col gap-4 opacity-75 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                  {pastReservations.map(renderReservationCard)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
