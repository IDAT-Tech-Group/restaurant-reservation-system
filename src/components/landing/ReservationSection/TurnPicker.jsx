import { cx } from '../../../lib/cx.js'
import { useState, useEffect } from 'react'
import { fetchApi } from '../../../services/api.js'
import { TIME_SLOTS as FALLBACK_SLOTS, TURN_DURATIONS as FALLBACK_DURATIONS } from '../../../constants/timeSlots.js'

export default function TurnPicker({ startTime, duration, onSelectTime, onChangeDuration }) {
  const [timeSlots, setTimeSlots] = useState(FALLBACK_SLOTS)
  const [turnDurations, setTurnDurations] = useState(FALLBACK_DURATIONS)

  useEffect(() => {
    fetchApi('/horarios')
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Extraemos fechas únicas si es array de objetos (ej. DB: { start_time: '12:00:00' })
          const extractedTimes = data.map(s => {
             if (s.start_time) return s.start_time.substring(0, 5)
             if (typeof s === 'string') return s.substring(0, 5)
             return null
          }).filter(Boolean)

          const uniqueTimes = [...new Set(extractedTimes)].sort()
          if (uniqueTimes.length > 0) setTimeSlots(uniqueTimes)

          // Extraemos duraciones únicas
          const extractedDurations = data.filter(s => s.duration).map(s => Number(s.duration))
          const uniqueDurs = [...new Set(extractedDurations)].sort((a,b) => a-b)
          
          if (uniqueDurs.length > 0) {
            setTurnDurations(uniqueDurs.map(d => ({
              label: d === 60 ? '1 Hora' : (d / 60) + ' Horas',
              value: d
            })))
          }
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      
      {/* Selector de Duración */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
          Duración del Turno
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {turnDurations.map((dur) => (
            <button
              key={dur.value}
              type="button"
              onClick={() => onChangeDuration(dur.value)}
              className={cx(
                'whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-150',
                duration === dur.value 
                  ? 'bg-gold border-gold text-ink cursor-default' 
                  : 'bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink dark:text-white hover:border-gold hover:text-ink dark:hover:text-white cursor-pointer'
              )}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Hora de Inicio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
          Hora de inicio
        </label>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => onSelectTime(time)}
              className={cx(
                'py-2 rounded-xl text-xs font-bold border transition-all duration-150',
                startTime !== time && 'bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink-soft dark:text-ink-ghost hover:border-gold hover:text-ink dark:hover:text-white cursor-pointer',
                startTime === time && 'bg-gold border-gold text-ink cursor-pointer',
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      
    </div>
  )
}
