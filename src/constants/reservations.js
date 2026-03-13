const _toLocalISO = (d) => {
  const y  = d.getFullYear()
  const m  = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export const TODAY_ISO = _toLocalISO(new Date())
export const TODAY_DAY = new Date().getDate()

export const MAX_DAYS_AHEAD = 15
export const MAX_DATE_ISO = (() => {
  const d = new Date()
  d.setDate(d.getDate() + MAX_DAYS_AHEAD)
  return _toLocalISO(d)
})()

export const ZONES = [
  { id: 'principal', name: 'Salón Principal', icon: '🏛️' },
  { id: 'terraza',   name: 'Terraza',         icon: '🌅' },
  { id: 'vip',       name: 'Área VIP',        icon: '✨' },
  { id: 'ventana',   name: 'Junto a Ventana', icon: '🪟' },
]

export const TABLES = [
  // Principal
  { id: 1, capacity: 2, zone: 'principal' },
  { id: 2, capacity: 2, zone: 'principal' },
  { id: 3, capacity: 4, zone: 'principal' },
  { id: 4, capacity: 4, zone: 'principal' },
  { id: 5, capacity: 6, zone: 'principal' },
  // Terraza
  { id: 6, capacity: 2, zone: 'terraza' },
  { id: 7, capacity: 4, zone: 'terraza' },
  { id: 8, capacity: 4, zone: 'terraza' },
  // VIP
  { id: 9, capacity: 8, zone: 'vip' },
  { id: 10, capacity: 8, zone: 'vip' },
  // Ventana
  { id: 11, capacity: 2, zone: 'ventana' },
  { id: 12, capacity: 4, zone: 'ventana' },
]

export const TOTAL_TABLES = TABLES.length

export const STATUS_LABEL = '🔒 Reservado'

export const INITIAL_RESERVATIONS = [
  { id: '001', name: 'Carlos García',  phone: '555-1234', date: '2026-03-01', startTime: '12:30', endTime: '14:00', persons: 2, table: 5, status: 'reservado' },
  { id: '002', name: 'María López',    phone: '555-5678', date: '2026-03-01', startTime: '13:00', endTime: '14:30', persons: 4, table: 7, status: 'reservado' },
  { id: '003', name: 'Juan Martínez',  phone: '555-9012', date: '2026-02-28', startTime: '13:30', endTime: '15:00', persons: 3, table: 2, status: 'reservado' },
  { id: '004', name: 'Rosa Rodríguez', phone: '555-3456', date: '2026-02-28', startTime: '19:00', endTime: '21:00', persons: 5, table: 3, status: 'reservado' },
  { id: '005', name: 'David Pérez',    phone: '555-7890', date: '2026-02-28', startTime: '20:00', endTime: '22:00', persons: 4, table: 4, status: 'reservado' },
  { id: '006', name: 'Ana González',   phone: '555-2468', date: '2026-02-28', startTime: '19:30', endTime: '21:00', persons: 2, table: 6, status: 'reservado' },
  { id: '007', name: 'Luis Herrera',   phone: '555-1111', date: '2026-03-02', startTime: '20:00', endTime: '22:30', persons: 6, table: 9, status: 'reservado' },
  { id: '008', name: 'Paula Ruiz',     phone: '555-2222', date: '2026-03-01', startTime: '14:00', endTime: '16:00', persons: 2, table: 1, status: 'reservado' },
]

export const STATS_CONFIG = [
  { emoji: '📆', label: 'Reservas Hoy',        key: 'reservasHoy',      variant: 'accent'  },
  { emoji: '🔒', label: 'Total Reservadas',     key: 'mesasReservadas',  variant: 'default' },
  { emoji: '✓',  label: 'Disponibles Hoy',      key: 'mesasDisponibles', variant: 'dark'    },
  { emoji: '📅', label: 'Total esta semana',    key: 'totalSemana',      variant: 'default' },
]

