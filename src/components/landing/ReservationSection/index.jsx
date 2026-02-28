import { useState, useCallback } from 'react'
import { usePersonCount } from '../../../hooks/usePersonCount.jsx'
import { useTimeSlot } from '../../../hooks/useTimeSlot.jsx'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import ReservationFormUI from './ReservationFormUI.jsx'

export default function ReservationSection() {
  const { addReservation } = useReservations()
  const personCount = usePersonCount()
  const timeSlot    = useTimeSlot()
  const [showSuccess, setShowSuccess] = useState(false)
  const [booking,     setBooking]     = useState(null)
  const [formKey,     setFormKey]     = useState(0)

  const handleSubmit = useCallback((formData) => {
    if (!timeSlot.selected) return { error: 'Por favor selecciona un horario' }

    const reservation = {
      ...formData,
      persons: personCount.count,
      time:    timeSlot.selected,
      table:   'auto',
    }

    addReservation(reservation)
    setBooking(reservation)
    setShowSuccess(true)
    personCount.reset()
    timeSlot.reset()
    setFormKey(k => k + 1)
    return { success: true }
  }, [timeSlot, personCount, addReservation])

  const handleClose = useCallback(() => setShowSuccess(false), [])

  return (
    <ReservationFormUI
      key={formKey}
      personCount={personCount}
      timeSlot={timeSlot}
      onSubmit={handleSubmit}
      showSuccess={showSuccess}
      booking={booking}
      onCloseSuccess={handleClose}
    />
  )
}
