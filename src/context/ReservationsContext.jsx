import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { isOverlapping } from '../lib/timeUtils.js'
import { getReservations, createReservation, deleteReservation } from '../services/reservationsService.js'
import { fetchApi } from '../services/api.js'
import { useAuth } from './AuthContext.jsx'

/**
 * CONTEXTO DE RESERVAS
 * Estado global de reservas, mesas y zonas para toda la aplicación.
 * Se conecta directamente al API de Laravel y mantiene los datos sincronizados.
 * Expone: reservations, tables, zones, isLoading, fetchData,
 *         addReservation, releaseTable, getAvailableTables, updateReservationStatus.
 */
const ReservationsContext = createContext(null)

export function ReservationsProvider({ children }) {
  // Usuario autenticado desde AuthContext (se usa para re-cargar datos al hacer login/logout)
  const { user } = useAuth()
  const [reservations, setReservations] = useState([])  // Lista de reservas del usuario (o todas si admin)
  const [tables, setTables]             = useState([])  // Lista de mesas disponibles
  const [zones, setZones]               = useState([])  // Lista de zonas del restaurante
  const [isLoading, setIsLoading]       = useState(true) // Indicador de carga inicial

  /**
   * Carga inicial de datos desde el API de Laravel.
   * Obtiene reservas y mesas en paralelo para optimizar el tiempo de carga.
   * También extrae las zonas de las relaciones anidadas de las mesas.
   * Se re-ejecuta automáticamente cuando el usuario inicia o cierra sesión (user?.id).
   */
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      // Lanzar ambas peticiones en paralelo; si alguna falla, devuelve array vacío
      const [resData, mesasData] = await Promise.all([
        getReservations().catch(() => []),
        fetchApi('/mesas').catch(() => [])
      ])
      
      setReservations(resData)

      // Laravel devuelve mesas con la zona anidada: { id, number, capacity, zone: { id, name, icon } }
      if (Array.isArray(mesasData)) {
        // Extraer zonas únicas del listado de mesas usando un Map para evitar duplicados
        const extractedZonesMap = new Map()
        const formattedTables = mesasData.map(t => {
          if (t.zone) {
            extractedZonesMap.set(t.zone.id, t.zone)
            // Aplanar la mesa: reemplazar el objeto zone por solo su ID
            return { ...t, zone: t.zone.id }
          }
          return t
        })

        setTables(formattedTables)
        
        // Si las mesas traen zonas anidadas, usarlas; si no, usar zonas por defecto
        if (extractedZonesMap.size > 0) {
          setZones(Array.from(extractedZonesMap.values()))
        } else {
          // Fallback mínimo en caso de que el API no devuelva zonas
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

  // Re-ejecutar fetchData cada vez que cambia el usuario (login/logout)
  // Esto garantiza que al iniciar sesión se carguen las reservas correctas
  useEffect(() => {
    fetchData()
  }, [fetchData, user?.id])

  /**
   * Crea una nueva reserva enviando los datos al API y actualiza el estado local.
   * Agrega la reserva al array local sin necesidad de re-hacer el fetch completo.
   *
   * @param {object} data - Datos del formulario (camelCase)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  const addReservation = useCallback(async (data) => {
    try {
      const response = await createReservation(data)
      if (response) {
         // Agregar optimistamente la nueva reserva al estado local
         setReservations(prev => [...prev, response])
         return { success: true, data: response }
      }
      return { success: false, error: "Error desconocido al guardar" }
    } catch (e) {
      return { success: false, error: e.message }
    }
  }, [])

  /**
   * Elimina una reserva por su ID.
   * Primero la borra en el servidor y luego la quita del estado local.
   *
   * @param {number} id - ID de la reserva a eliminar
   */
  const releaseTable = useCallback(async (id) => {
    await deleteReservation(id)
    // Actualizar el estado local filtrando la reserva eliminada
    setReservations(prev => prev.filter(r => r.id !== id))
  }, [])

  /**
   * Actualiza el estado de una reserva (pendiente → reservado → completado → cancelado).
   * Llama al endpoint PATCH del API y actualiza el estado local de forma optimista.
   *
   * @param {number} id        - ID de la reserva
   * @param {string} newStatus - Nuevo estado ('pendiente', 'reservado', 'completado', 'cancelado')
   */
  const updateReservationStatus = useCallback(async (id, newStatus) => {
    // Notificar al backend el cambio de estado
    await fetchApi(`/reservas/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus })
    }).catch(console.error)

    // Actualizar el estado local sin re-cargar toda la lista
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
  }, [])

  /**
   * Devuelve las mesas disponibles para una fecha y rango horario específico.
   * Filtra por zona y capacidad mínima, luego excluye las mesas ya ocupadas
   * usando la lógica de solapamiento de horarios (isOverlapping).
   *
   * @param {string} date           - Fecha a verificar (YYYY-MM-DD)
   * @param {string} startTime      - Hora de inicio deseada (HH:MM)
   * @param {string} endTime        - Hora de fin deseada (HH:MM)
   * @param {object} capacityObj    - Filtros opcionales: { persons, zone }
   * @returns {object[]}            - Array de mesas disponibles
   */
  const getAvailableTables = useCallback((date, startTime, endTime, capacityObj = { persons: 0, zone: '' }) => {
    let candidateTables = tables
    // Filtrar por zona si se especificó una
    if (capacityObj.zone) {
      candidateTables = candidateTables.filter(t => t.zone === capacityObj.zone)
    }
    // Filtrar por capacidad mínima requerida
    if (capacityObj.persons > 0) {
      candidateTables = candidateTables.filter(t => t.capacity >= capacityObj.persons)
    }

    // Encontrar reservas que se solapan en la misma fecha y horario
    const conflictingReservations = reservations.filter(r => {
      if (r.date !== date) return false
      return isOverlapping(startTime, endTime, r.startTime || r.start_time, r.endTime || r.end_time)
    })

    // Construir un Set con los IDs de mesas ya ocupadas en ese horario
    const occupiedTableIds = new Set(conflictingReservations.map(r => Number(r.table_id || r.table)))

    // Retornar solo las mesas que no están ocupadas
    return candidateTables.filter(t => !occupiedTableIds.has(t.id))
  }, [reservations, tables])

  return (
    <ReservationsContext.Provider value={{
      reservations, 
      tables,
      zones,
      isLoading,
      fetchData,
      addReservation, 
      releaseTable, 
      getAvailableTables, 
      updateReservationStatus 
    }}>
      {children}
    </ReservationsContext.Provider>
  )
}

/**
 * Hook personalizado para consumir el ReservationsContext.
 * Lanza un error descriptivo si se usa fuera del provider.
 *
 * @returns {{ reservations, tables, zones, isLoading, fetchData,
 *             addReservation, releaseTable, getAvailableTables, updateReservationStatus }}
 */
export function useReservations() {
  const ctx = useContext(ReservationsContext)
  if (!ctx) throw new Error('useReservations debe usarse dentro de ReservationsProvider')
  return ctx
}
