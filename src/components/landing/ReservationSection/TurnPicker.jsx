import { cx } from '../../../lib/cx.js'
import { TIME_SLOTS, TURN_DURATIONS } from '../../../constants/timeSlots.js'

export default function TurnPicker({ startTime, duration, onSelectTime, onChangeDuration }) {
  return (
    <div className="flex flex-col gap-4">
      
      {/* Selector de Duración */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
          Duración del Turno
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TURN_DURATIONS.map((dur) => (
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
          {TIME_SLOTS.map((time) => (
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
