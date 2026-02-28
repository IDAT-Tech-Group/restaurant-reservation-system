import { useState, useMemo, useCallback } from 'react'
import Button from '../../ui/Button.jsx'
import Badge from '../../ui/Badge.jsx'
import { cx } from '../../../lib/cx.js'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { STATUS_LABEL } from '../../../constants/reservations.js'

const WEEKDAYS    = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const daysInMonth   = (y, m) => new Date(y, m + 1, 0).getDate()
const firstWeekday  = (y, m) => new Date(y, m, 1).getDay()
const toISO         = (y, m, d) => `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`

const NOW           = new Date()
const CURRENT_YEAR  = NOW.getFullYear()
const CURRENT_MONTH = NOW.getMonth()
const TODAY_DAY     = NOW.getDate()
// Fecha local para evitar desfase UTC
const TODAY_ISO     = toISO(CURRENT_YEAR, CURRENT_MONTH, TODAY_DAY)

export default function CalendarView() {
  const { reservations } = useReservations()

  const [viewYear,  setViewYear]  = useState(CURRENT_YEAR)
  const [viewMonth, setViewMonth] = useState(CURRENT_MONTH)
  const [selected,  setSelected]  = useState(TODAY_DAY)

  const goToPrev = useCallback(() => {
    setViewMonth(m => {
      if (m === 0) { setViewYear(y => y - 1); return 11 }
      return m - 1
    })
    setSelected(null)
  }, [])

  const goToNext = useCallback(() => {
    setViewMonth(m => {
      if (m === 11) { setViewYear(y => y + 1); return 0 }
      return m + 1
    })
    setSelected(null)
  }, [])

  const goToToday = useCallback(() => {
    setViewYear(CURRENT_YEAR)
    setViewMonth(CURRENT_MONTH)
    setSelected(TODAY_DAY)
  }, [])

  // Mapa: día → reservas del mes visible
  const reservasByDay = useMemo(() => {
    const prefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-`
    const map = {}
    reservations.forEach(r => {
      if (!r.date.startsWith(prefix)) return
      const day = parseInt(r.date.split('-')[2], 10)
      if (!map[day]) map[day] = []
      map[day].push(r)
    })
    return map
  }, [reservations, viewYear, viewMonth])

  const totalDays = daysInMonth(viewYear, viewMonth)
  const offset    = firstWeekday(viewYear, viewMonth)

  const cells = useMemo(() => [
    ...Array(offset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ], [offset, totalDays])

  const isCurrentMonth = viewYear === CURRENT_YEAR && viewMonth === CURRENT_MONTH
  // No permitir ir a meses anteriores al actual
  const canGoPrev = !isCurrentMonth

  const handleSelect = useCallback((day) => {
    if (day) setSelected(d => d === day ? null : day)
  }, [])

  const selectedISO      = selected ? toISO(viewYear, viewMonth, selected) : null
  const selectedReservas = selected ? (reservasByDay[selected] ?? []) : []
  const isPastDay        = selectedISO && selectedISO < TODAY_ISO

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Calendario 📅</h1>
        <p className="text-ink-soft dark:text-ink-ghost mt-1">Vista mensual de tus reservas</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* ── Grilla del mes ── */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-7 shadow-sm2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-ink dark:text-white">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={goToPrev} disabled={!canGoPrev}>← Ant.</Button>
              {!isCurrentMonth && (
                <Button variant="gold" size="sm" onClick={goToToday}>Hoy</Button>
              )}
              <Button variant="ghost" size="sm" onClick={goToNext}>Sig. →</Button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-3">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-black uppercase tracking-widest text-ink-ghost py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((day, i) => {
              const iso     = day ? toISO(viewYear, viewMonth, day) : null
              const isPast  = iso && iso < TODAY_ISO
              const isToday = isCurrentMonth && day === TODAY_DAY
              const hasRes  = day && !!reservasByDay[day]?.length
              const isSel   = selected === day

              return (
                <div
                  key={i}
                  onClick={() => handleSelect(day)}
                  className={cx(
                    'aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-150',
                    !day  && 'cursor-default',
                    day   && 'cursor-pointer',
                    day && !isToday && !isSel && !isPast && 'hover:bg-border-col dark:hover:bg-dark-border',
                    day && isPast  && 'opacity-35',
                    isToday && !isSel && 'bg-ink dark:bg-dark-surface2',
                    isSel && 'bg-gold',
                  )}
                >
                  {day && (
                    <>
                      <span className={cx(
                        'text-sm font-bold leading-none',
                        isSel    ? 'text-ink font-black'
                        : isToday ? 'text-white'
                        : 'text-ink dark:text-white'
                      )}>
                        {day}
                      </span>
                      {hasRes && (
                        <span className={cx(
                          'w-1.5 h-1.5 rounded-full mt-1',
                          isSel    ? 'bg-ink'
                          : isToday ? 'bg-gold'
                          : 'bg-gold-dark'
                        )} />
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-border-col dark:border-dark-border flex gap-6 flex-wrap">
            {[
              ['bg-gold-dark',                 'Tiene reservas'],
              ['bg-ink dark:bg-dark-surface2', 'Hoy'],
              ['bg-gold',                      'Seleccionado'],
            ].map(([bg, label]) => (
              <div key={label} className="flex items-center gap-2 text-xs font-semibold text-ink-soft dark:text-ink-ghost">
                <span className={`w-2.5 h-2.5 rounded-full ${bg}`} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Panel detalle del día ── */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2 sticky top-24">
          <div className="mb-4">
            <h3 className="text-lg font-black text-ink dark:text-white">
              {selected
                ? `${String(selected).padStart(2,'0')} ${MONTH_NAMES[viewMonth].toLowerCase()} ${viewYear}`
                : 'Selecciona un día'}
            </h3>
            {selected && (
              <p className="text-xs text-ink-ghost dark:text-ink-ghost mt-0.5">
                {isPastDay ? 'Fecha pasada · ' : ''}
                {selectedReservas.length} reserva(s)
              </p>
            )}
          </div>

          {!selected && (
            <p className="text-sm text-ink-ghost dark:text-ink-ghost text-center py-8">
              Haz clic en un día del calendario
            </p>
          )}

          {selected && selectedReservas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">✓</p>
              <p className="text-sm font-semibold text-ink-soft dark:text-ink-ghost">Sin reservas ese día</p>
              <p className="text-xs text-ink-ghost dark:text-ink-ghost mt-1">Todas las mesas disponibles</p>
            </div>
          )}

          {selectedReservas.length > 0 && (
            <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
              {selectedReservas.map(r => (
                <div key={r.id} className="p-3 rounded-xl bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="text-sm font-black text-ink dark:text-white">{r.name}</p>
                      <p className="text-xs text-ink-ghost dark:text-ink-ghost">{r.phone}</p>
                    </div>
                    <Badge variant="green">{STATUS_LABEL}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-ink-soft dark:text-ink-ghost">
                    <span>🕐 {r.time}</span>
                    <span>🪑 {r.table === 'auto' ? 'Mesa auto' : `Mesa ${r.table}`}</span>
                    <span>👥 {r.persons} pers.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
