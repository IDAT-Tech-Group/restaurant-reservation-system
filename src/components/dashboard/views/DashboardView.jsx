import { useMemo } from 'react'
import StatCard from '../../ui/StatCard.jsx'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { useSettings } from '../../../context/SettingsContext.jsx'
import { STATS_CONFIG, TODAY_ISO } from '../../../constants/reservations.js'

const TODAY_LABEL = new Date().toLocaleDateString('es-ES', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

const _localISO = (d) => {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

const getWeekRange = () => {
  const now = new Date()
  const mon = new Date(now)
  mon.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return [_localISO(mon), _localISO(sun)]
}

export default function DashboardView() {
  const { reservations } = useReservations()
  const { settings } = useSettings()

  const stats = useMemo(() => {
    const todayActive      = reservations.filter(r => r.date === TODAY_ISO)
    const reservasHoy      = todayActive.length
    const mesasReservadas  = reservations.length
    const mesasDisponibles = settings.tables - new Set(todayActive.map(r => r.table)).size
    const [weekStart, weekEnd] = getWeekRange()
    const totalSemana = reservations.filter(r => r.date >= weekStart && r.date <= weekEnd).length
    return { reservasHoy, mesasReservadas, mesasDisponibles, totalSemana }
  }, [reservations])

  // Horario del día derivado de las reservas reales de hoy
  const timelineSlots = useMemo(() => {
    const todayRes = reservations
      .filter(r => r.date === TODAY_ISO)
      .sort((a, b) => a.time.localeCompare(b.time))

    const grouped = {}
    todayRes.forEach(r => {
      if (!grouped[r.time]) grouped[r.time] = []
      grouped[r.time].push(r)
    })

    return Object.entries(grouped).map(([time, res]) => ({ time, reservas: res }))
  }, [reservations])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Buen día, Admin 👋</h1>
        <p className="text-ink-soft dark:text-ink-ghost mt-1 capitalize">Resumen de actividad · {TODAY_LABEL}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CONFIG.map(s => (
          <StatCard key={s.label} emoji={s.emoji} label={s.label} value={String(stats[s.key])} variant={s.variant} />
        ))}
      </div>

      {/* Horario del día */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-7 shadow-sm2">
        <h2 className="text-lg font-black text-ink dark:text-white mb-5">⏱️ Horario de hoy</h2>

        {timelineSlots.length === 0 ? (
          <p className="text-sm text-ink-ghost dark:text-ink-ghost text-center py-6">
            Sin reservas activas para hoy
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {timelineSlots.map(({ time, reservas }) => (
              <div
                key={time}
                className="flex gap-4 items-start border-b border-border-col dark:border-dark-border pb-4 last:border-0 last:pb-0"
              >
                <span className="text-xs font-bold text-ink-soft dark:text-ink-ghost pt-1 w-16 shrink-0">
                  {time}
                </span>
                <div className="flex flex-wrap gap-2">
                  {reservas.map(r => (
                    <span
                      key={r.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-xs font-bold bg-gold/15 dark:bg-gold/10 text-ink dark:text-white border border-gold/30"
                    >
                      🪑 {r.table === 'auto' ? 'Auto' : `Mesa ${r.table}`} · {r.name.split(' ')[0]} ({r.persons} pers.)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
