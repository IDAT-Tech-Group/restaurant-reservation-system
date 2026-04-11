import React, { useState, useCallback } from 'react'
import Button from '../../ui/Button.jsx'
import FormField from '../../ui/FormField.jsx'
import TimeSlotPicker from './TimeSlotPicker.jsx' // To be removed
import TurnPicker from './TurnPicker.jsx'
import InteractiveTableMap from './InteractiveTableMap.jsx'
import LoginModal from './LoginModal.jsx'
import SuccessModal from '../SuccessModal.jsx'
import { TODAY_ISO, MAX_DATE_ISO } from '../../../constants/reservations.js'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { useAuth } from '../../../context/AuthContext'
import { addTime } from '../../../lib/timeUtils.js'

const PERKS = [
  'Confirmación inmediata por correo',
  'Cancelación gratuita hasta 2 horas antes',
  'Podemos acomodar eventos y cumpleaños',
  'Menú especial para alergias e intolerancias',
  'Estacionamiento gratuito disponible',
]

export default function ReservationFormUI({
  personCount,
  timeSlot,
  onSubmit,
  showSuccess,
  booking,
  onCloseSuccess
}) {

  const { user } = useAuth()   // ✅ ahora sí existe user
  const { getAvailableTables, zones: ZONES } = useReservations()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(TODAY_ISO)
  const [zone, setZone] = useState('')

  React.useEffect(() => {
    if (ZONES && ZONES.length > 0 && !zone) {
      setZone(ZONES[0].id)
    }
  }, [ZONES, zone])
  const [selectedTable, setSelectedTable] = useState(null)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Calcular mesas disponibles usando nuestra nueva función del contexto
  const endTime = timeSlot.startTime ? addTime(timeSlot.startTime, timeSlot.duration) : null
  
  const availableTables = React.useMemo(() => {
    if (!date || !timeSlot.startTime || !endTime) return []
    return getAvailableTables(date, timeSlot.startTime, endTime, {
      zone, 
      persons: personCount.count 
    })
  }, [date, timeSlot.startTime, endTime, zone, personCount.count, getAvailableTables])

  const submitReservation = useCallback(async (forceBypassAuth = false) => {
    if (!user && !forceBypassAuth) {
      setError("Inicia sesión o regístrate para separar tu mesa.")
      setIsLoginModalOpen(true)
      return
    }

    if (!selectedTable) {
      setError("Por favor selecciona una mesa disponible del mapa")
      return
    }

    setError('')

    const result = await onSubmit({
      name,
      phone,
      email: user.username,
      date,
      zone, 
      endTime, // Se usará en el context para cruces
      table: selectedTable, // Ahora es el ID explícito de la mesa
      notes
    })

    if (result?.error) {
      setError(result.error)
      return
    }
  }, [name, phone, date, endTime, selectedTable, notes, user, onSubmit])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    submitReservation()
  }, [submitReservation])

  const handleLoginSuccess = useCallback(() => {
    setIsLoginModalOpen(false)
    // Se fuerza el bypass xq el context update de 'user' puede no estar listo en este render tick
    submitReservation(true) 
  }, [submitReservation])

  return (
    <section id="reservar" className="bg-ink dark:bg-dark-bg py-24 px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-20 items-start">

        {/* Left info */}
        <div>
          <span className="bg-gold text-ink text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-pill">
            Reserva tu mesa
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mt-4 mb-4">
            ¿Cuándo te vemos?
          </h2>

          <p className="text-white/60 leading-relaxed mb-8">
            Reservar solo toma un momento.
          </p>

          <ul className="flex flex-col gap-3">
            {PERKS.map(perk => (
              <li key={perk} className="flex items-center gap-3 text-sm font-semibold text-white/80">
                <span className="w-2 h-2 rounded-full bg-gold shrink-0" />
                {perk}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-xs text-white/40">
            📅 Reservas disponibles hasta 15 días de anticipación
          </p>
        </div>

        {/* Form card */}
        <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-8 shadow-lg2">

          <div className="font-black text-xl text-ink dark:text-white mb-1">
            📝 Completa tu reserva
          </div>

          <div className="text-sm text-ink-soft dark:text-ink-ghost mb-6">
            Todos los campos son obligatorios salvo las notas.
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Nombre"
                id="f-name"
                placeholder="Tu nombre"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />

              <FormField
                label="Teléfono"
                id="f-phone"
                type="tel"
                placeholder="+1 555 000 0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            {/* FECHA + PERSONAS */}

            <div className="grid grid-cols-2 gap-4">

              <div className="flex flex-col gap-1.5">
                <FormField
                  label="Fecha"
                  id="f-date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={TODAY_ISO}
                  max={MAX_DATE_ISO}
                  required
                />

                <p className="text-[11px] text-ink-ghost">
                  Máx. 15 días de anticipación
                </p>
              </div>

              <div className="flex flex-col gap-1.5">

                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
                  Personas
                </label>

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={personCount.decrement}
                    className="w-9 h-9 rounded-xl bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border text-lg font-bold flex items-center justify-center hover:bg-gold hover:border-gold transition-all cursor-pointer"
                  >
                    −
                  </button>

                  <span className="text-xl font-black text-ink dark:text-white w-6 text-center">
                    {personCount.count}
                  </span>

                  <button
                    type="button"
                    onClick={personCount.increment}
                    className="w-9 h-9 rounded-xl bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border text-lg font-bold flex items-center justify-center hover:bg-gold hover:border-gold transition-all cursor-pointer"
                  >
                    +
                  </button>

                  <span className="text-xs text-ink-ghost">pers.</span>

                </div>

              </div>

            </div>

            {/* HORARIO */}

            <div className="flex flex-col gap-1.5">

              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
                Turno
              </label>

              <TurnPicker
                startTime={timeSlot.startTime}
                duration={timeSlot.duration}
                onSelectTime={timeSlot.selectTime}
                onChangeDuration={timeSlot.changeDuration}
              />

            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost mb-1">
                2. Elige tu Zona Preferida
              </label>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {ZONES.map(z => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => {
                      setZone(z.id)
                      setSelectedTable(null) // Reset al cambiar zona
                    }}
                    className={`py-3 px-2 rounded-xl border-2 text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                      zone === z.id 
                      ? 'bg-ink dark:bg-white text-white dark:text-ink border-ink dark:border-white shadow-md' 
                      : 'bg-surface dark:bg-dark-surface border-border-col dark:border-dark-border text-ink-soft hover:border-ink/20'
                    }`}
                  >
                    <span className="text-xl leading-none">{z.icon}</span>
                    <span>{z.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {timeSlot.startTime ? (
              <div className="flex flex-col gap-1.5 mt-4 p-4 rounded-xl border border-border-col dark:border-dark-border bg-ink/5 dark:bg-white/5">
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-soft dark:text-ink-ghost">
                    3. Selecciona tu mesa 
                  </label>
                  <span className="text-[10px] bg-gold/20 text-gold-dark px-2 rounded-full font-bold">
                    {timeSlot.startTime} a {endTime}
                  </span>
                </div>
                
                <InteractiveTableMap 
                  availableTables={availableTables}
                  selectedTableId={selectedTable}
                  onSelectTable={setSelectedTable}
                  requiredPersons={personCount.count}
                />
              </div>
            ) : (
                <div className="text-center p-4 border border-dashed rounded-xl border-border-col dark:border-dark-border text-xs text-ink-ghost">
                  Debes seleccionar un horario primero para ver las mesas disponibles.
                </div>
            )}

            <FormField
              label="Notas especiales (opcional)"
              id="f-notes"
              as="textarea"
              placeholder="Cumpleaños, alergias, peticiones…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
            />

            {error && (
              <p className="text-sm text-red-500 font-semibold mt-2 bg-red-50 dark:bg-red-900/10 p-2 rounded text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full justify-center mt-1"
            >
              ✅ Confirmar reserva
            </Button>

          </form>

        </div>
      </div>

      {showSuccess && booking && (
        <SuccessModal
          booking={booking}
          onClose={onCloseSuccess}
        />
      )}

      {isLoginModalOpen && (
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={handleLoginSuccess}
          initialName={name}
          initialPhone={phone}
        />
      )}

    </section>
  )
}