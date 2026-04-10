import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { isOverlapping } from '../lib/timeUtils.js'
import { getReservations, createReservation, deleteReservation } from '../services/reservationsService.js'
import { fetchApi } from '../services/api.js'

const ReservationsContext = createContext(null)

export function ReservationsProvider({ children }) {
  const [reservations, setReservations] = useState([])
  const [tables, setTables] = useState([])
  const [zones, setZones] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch initial data from Laravel API
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      // Ejecutar las promesas en paralelo
      const [resData, mesasData] = await Promise.all([
        getReservations().catch(() => []),
        fetchApi('/mesas').catch(() => [])
      ])
      
      setReservations(resData)

      // Asumimos que `/mesas` trae [ { id, capacity, number, zone: { id, name, icon } }, ... ]
      // o adaptarlo según la estructura del JSON normal de Laravel
      if (Array.isArray(mesasData)) {
        // En base a la estructura original: TABLES usa id, capacity, zone (string o ID)
        // ZONES usa id, name, icon
        const extractedZonesMap = new Map()
        const formattedTables = mesasData.map(t => {
          if (t.zone) {
            extractedZonesMap.set(t.zone.id, t.zone)
            return { ...t, zone: t.zone.id }
          }
          return t
        })

        setTables(formattedTables)
        
        // Si no vienen zonas anidadas, quizás deberíamos obtenerlas de `/zonas` o usar default
        if (extractedZonesMap.size > 0) {
          setZones(Array.from(extractedZonesMap.values()))
        } else {
          // Fallback mínimo
          setZones([
            { id: 1, name: 'Salón Principal', icon: '🏛️' },
            { id: 2, name: 'Terraza', icon: '🌅' },
            { id: 3, name: 'Área VIP', icon: '✨' },
            { id: 4, name: 'Junto a Ventana', icon: '🪟' }
          ])
        }
      }
    } catch (e) {
      console.error("Error cargando reservas y mesas:", e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const addReservation = useCallback(async (data) => {
    try {
      const response = await createReservation(data)
      if (response) {
         setReservations(prev => [...prev, response])
         return { success: true, data: response }
      }
      return { success: false, error: "Error desconocido al guardar" }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }, [])

  const releaseTable = useCallback(async (id) => {
    await deleteReservation(id)
    setReservations(prev => prev.filter(r => r.id !== id))
  }, [])

  const updateReservationStatus = useCallback(async (id, newStatus) => {
    // Endpoint para actualizar estado pago
    await fetchApi(`/reservas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    }).catch(console.error)

    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }, [])

  const getAvailableTables = useCallback((date, startTime, endTime, capacityObj = { persons: 0, zone: '' }) => {
    let candidateTables = tables
    if (capacityObj.zone) {
      candidateTables = candidateTables.filter(t => t.zone === capacityObj.zone)
    }
    if (capacityObj.persons > 0) {
      candidateTables = candidateTables.filter(t => t.capacity >= capacityObj.persons)
    }

    const conflictingReservations = reservations.filter(r => {
      // Comparación estricta de fecha o manejamos fechas en diferentes formatos
      if (r.date !== date) return false
      return isOverlapping(startTime, endTime, r.startTime || r.start_time, r.endTime || r.end_time)
    })

    const occupiedTableIds = new Set(conflictingReservations.map(r => Number(r.table_id || r.table)))

    return candidateTables.filter(t => !occupiedTableIds.has(t.id))
  }, [reservations, tables])

  return (
    <ReservationsContext.Provider value={{
      reservations, 
      tables,
      zones,
      isLoading,
      addReservation, 
      releaseTable, 
      getAvailableTables, 
      updateReservationStatus 
    }}>
      {children}
    </ReservationsContext.Provider>
  )
}

export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) throw new Error('useReservations debe usarse dentro de ReservationsProvider')
  return ctx
}
