import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { INITIAL_RESERVATIONS, TABLES } from '../constants/reservations.js'
import { isOverlapping } from '../lib/timeUtils.js'

const LS_KEY = 'restaurant_reservations'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Migración para actualizar las reservas antiguas de Dick Arrunategui a 'pendiente'
      const migrated = parsed.map(r => {
        if (r.name && r.name.toLowerCase().includes('dick') && r.status === 'reservado') {
          return { ...r, status: 'pendiente' }
        }
        return r
      })
      return migrated
    }
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
      return [...prev, { ...data, id, status: data.status || 'pendiente' }]
    })
  }, [])

  const releaseTable = useCallback((id) => {
    setReservations(prev => prev.filter(r => r.id !== id))
  }, [])

  const updateReservationStatus = useCallback((id, newStatus) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }, [])

  // Novedad: Obtener mesas disponibles para un dia + rango de tiempo + capacidad opcional
  const getAvailableTables = useCallback((date, startTime, endTime, capacityObj = { persons: 0, zone: '' }) => {

    // Filtrar mesas por zona o capacidad previamente si se pasaron parámetros
    let candidateTables = TABLES
    if (capacityObj.zone) {
      candidateTables = candidateTables.filter(t => t.zone === capacityObj.zone)
    }
    if (capacityObj.persons > 0) {
      candidateTables = candidateTables.filter(t => t.capacity >= capacityObj.persons)
    }

    // Reservas que chocan ese día
    const conflictingReservations = reservations.filter(r => {
      if (r.date !== date) return false
      // Usa las funciones del util
      return isOverlapping(startTime, endTime, r.startTime, r.endTime)
    })

    const occupiedTableIds = new Set(conflictingReservations.map(r => Number(r.table)))

    // Retorna solo las mesas candidatas que NO están ocupadas
    return candidateTables.filter(t => !occupiedTableIds.has(t.id))
  }, [reservations])

  return (
    <ReservationsContext.Provider value={{ reservations, addReservation, releaseTable, getAvailableTables, updateReservationStatus }}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) throw new Error('useReservations debe usarse dentro de ReservationsProvider')
  return ctx
}
