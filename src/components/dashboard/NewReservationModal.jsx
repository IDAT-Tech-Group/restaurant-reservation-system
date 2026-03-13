import { useState, useCallback, useMemo } from 'react'
import Button from '../ui/Button.jsx'
import FormField from '../ui/FormField.jsx'
import { usePersonCount } from '../../hooks/usePersonCount.jsx'
import { useReservations } from '../../context/ReservationsContext.jsx'
import { TODAY_ISO, MAX_DATE_ISO, TABLES, ZONES } from '../../constants/reservations.js'
import { addTime } from '../../lib/timeUtils.js'

export default function NewReservationModal({ isOpen, onClose }) {
  const { reservations, addReservation, getAvailableTables } = useReservations()
  const personCount = usePersonCount()
  const [name,  setName]  = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [date,  setDate]  = useState(TODAY_ISO)
  const [startTime,  setStartTime]  = useState('19:00')
  const [duration, setDuration] = useState(120) // Default 2 hours
  const [table, setTable] = useState('')
  const [notes, setNotes] = useState('')

  const endTime = addTime(startTime, duration)

  // Mesas disponibles para la fecha + rango de tiempo seleccionado
  const availableTablesIds = useMemo(() => {
    // Si no hay hora válida, asume vacío
    if (!date || !startTime || !endTime) return new Set()
    
    // Obtenemos todas las mesas libres sin filtrar por zona ni personas (el admin ve todas)
    const available = getAvailableTables(date, startTime, endTime, { persons: 0, zone: '' })
    return new Set(available.map(t => t.id))
  }, [date, startTime, endTime, getAvailableTables])

  const handleDateChange = useCallback((e) => {
    setDate(e.target.value)
    setTable('')
  }, [])

  const handleClose = useCallback(() => {
    setName(''); setPhone(''); setEmail('')
    setDate(TODAY_ISO); setStartTime('19:00'); setDuration(120); setTable(''); setNotes('')
    personCount.reset()
    onClose()
  }, [personCount, onClose])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    if (!table) return
    addReservation({ 
      name, 
      phone, 
      email, 
      date, 
      startTime, 
      endTime, 
      persons: personCount.count, 
      zone: TABLES.find(t => t.id === Number(table))?.zone || 'principal',
      table: Number(table), 
      notes 
    })
    handleClose()
  }, [name, phone, email, date, startTime, endTime, table, notes, personCount, addReservation, handleClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-surface dark:bg-dark-surface rounded-xl2 p-8 w-11/12 max-w-lg shadow-lg2 max-h-[90vh] overflow-y-auto animate-[popIn_.22s_ease]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-ink dark:text-white">📝 Nueva Reserva</h2>
          <button
            onClick={handleClose}
            className="w-9 h-9 rounded-xl bg-bg dark:bg-dark-bg border-0 flex items-center justify-center text-ink-soft dark:text-ink-ghost cursor-pointer hover:bg-border-col dark:hover:bg-dark-border transition-colors"
          >✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nombre" id="m-name" placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Teléfono" id="m-phone" type="tel" placeholder="+1 555 000" value={phone} onChange={e => setPhone(e.target.value)} required />
            <FormField label="Email" id="m-email" type="email" placeholder="correo@mail.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <FormField label="Fecha" id="m-date" type="date" value={date} onChange={handleDateChange} min={TODAY_ISO} max={MAX_DATE_ISO} required />
            </div>
            <FormField label="Hora" id="m-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
                Duración
              </label>
              <select 
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full h-12 px-4 rounded-xl border border-border-col dark:border-dark-border bg-bg dark:bg-dark-bg text-sm font-semibold text-ink dark:text-white outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              >
                <option value={60}>1 Hora</option>
                <option value={90}>1.5 Horas</option>
                <option value={120}>2 Horas</option>
                <option value={180}>3 Horas</option>
              </select>
            </div>
          </div>

          {/* Personas */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">Personas</label>
            <div className="flex items-center gap-2">
              <button type="button" onClick={personCount.decrement} className="w-8 h-8 rounded-lg bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border font-bold cursor-pointer hover:bg-gold hover:border-gold transition-all">−</button>
              <span className="w-6 text-center font-black text-ink dark:text-white">{personCount.count}</span>
              <button type="button" onClick={personCount.increment} className="w-8 h-8 rounded-lg bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border font-bold cursor-pointer hover:bg-gold hover:border-gold transition-all">+</button>
            </div>
          </div>

          {/* Selector de mesas */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
              Mesa — <span className="normal-case font-normal">selecciona una disponible para las {startTime} - {endTime}</span>
            </label>
            <div className="flex flex-col gap-4">
              {ZONES.map(z => {
                const zoneTables = TABLES.filter(t => t.zone === z.id)
                if (zoneTables.length === 0) return null
                return (
                  <div key={z.id}>
                    <p className="text-[11px] font-black uppercase text-ink-soft dark:text-ink-ghost tracking-widest mb-2">{z.icon} {z.name}</p>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {zoneTables.map(t => {
                        const isReserved = !availableTablesIds.has(t.id)
                        const isSelected = table === String(t.id)
                        return (
                          <button
                            key={t.id}
                            type="button"
                            disabled={isReserved}
                            onClick={() => setTable(String(t.id))}
                            className={
                              isReserved
                                ? 'h-12 rounded-xl border-2 text-sm font-bold cursor-not-allowed opacity-40 bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-500 flex flex-col items-center justify-center'
                                : isSelected
                                  ? 'h-12 rounded-xl border-2 text-sm font-bold cursor-pointer bg-gold border-gold text-ink flex flex-col items-center justify-center shadow-md'
                                  : 'h-12 rounded-xl border-2 text-sm font-bold cursor-pointer bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink dark:text-white hover:border-gold hover:bg-gold/10 transition-all flex flex-col items-center justify-center'
                            }
                          >
                            <span className="block text-base leading-none mb-0.5">{isReserved ? '🔒' : '🪑'}</span>
                            <span className="block text-[10px] leading-none">{t.id} <span className="opacity-60 font-semibold">({t.capacity}p)</span></span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-[11px] text-ink-ghost mt-0.5">
              {table ? `✓ Mesa ${table} seleccionada` : '🔒 Ocupada · 🪑 Disponible'}
            </p>
          </div>

          <FormField label="Notas" id="m-notes" as="textarea" placeholder="Notas especiales…" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

          <div className="flex justify-end gap-3 mt-2">
            <Button variant="ghost" type="button" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="gold" disabled={!table}>✅ Crear Reserva</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
