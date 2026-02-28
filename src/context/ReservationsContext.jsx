import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { INITIAL_RESERVATIONS } from '../constants/reservations.js'

const LS_KEY = 'restaurant_reservations'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    console.warn('No se pudieron cargar las reservas desde localStorage, usando datos iniciales')
  }
  return INITIAL_RESERVATIONS
}

const ReservationsContext = createContext(null)

export function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState(loadFromStorage)

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(reservations))
  }, [reservations])

  useEffect(() => {
    function onStorage(e) {
      if (e.key !== LS_KEY || e.newValue === null) return
      try {
        setReservations(JSON.parse(e.newValue))
      } catch {
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addReservation = useCallback((data) => {
    setReservations(prev => {
      const id = String(Math.max(0, ...prev.map(r => parseInt(r.id, 10))) + 1).padStart(3, '0')
      return [...prev, { ...data, id, status: 'reservado' }]
    })
  }, [])

  const releaseTable = useCallback((id) => {
    setReservations(prev => prev.filter(r => r.id !== id))
  }, [])

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, releaseTable }}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) throw new Error('useReservations debe usarse dentro de ReservationsProvider')
  return ctx
}
