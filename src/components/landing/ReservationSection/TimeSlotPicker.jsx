import { cx } from '../../../lib/cx.js'
import { TIME_SLOTS } from '../../../constants/timeSlots.js'

export default function TimeSlotPicker({ selectedTime, onSelect }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {TIME_SLOTS.map(({ time, available }) => (
        <button
          key={time}
          type="button"
          disabled={!available}
          onClick={() => available && onSelect(time)}
          className={cx(
            'py-2 rounded-xl text-xs font-bold border transition-all duration-150',
            !available && 'line-through opacity-40 cursor-not-allowed bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink-ghost',
            available && selectedTime !== time && 'bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink-soft dark:text-ink-ghost hover:border-gold hover:text-ink dark:hover:text-white cursor-pointer',
            available && selectedTime === time && 'bg-gold border-gold text-ink cursor-pointer',
          )}
        >
          {time}
        </button>
      ))}
    </div>
  )
}
