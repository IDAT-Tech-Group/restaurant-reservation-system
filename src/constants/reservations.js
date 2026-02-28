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

export const TOTAL_TABLES = 10
export const TABLE_NUMBERS = Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1)

export const STATUS_LABEL = '🔒 Reservado'

export const INITIAL_RESERVATIONS = [
  { id: '001', name: 'Carlos García',  phone: '555-1234', date: '2026-03-01', time: '12:30', persons: 2, table: 5, status: 'reservado' },
  { id: '002', name: 'María López',    phone: '555-5678', date: '2026-03-01', time: '13:00', persons: 4, table: 7, status: 'reservado' },
  { id: '003', name: 'Juan Martínez',  phone: '555-9012', date: '2026-02-28', time: '13:30', persons: 3, table: 2, status: 'reservado' },
  { id: '004', name: 'Rosa Rodríguez', phone: '555-3456', date: '2026-02-28', time: '19:00', persons: 5, table: 3, status: 'reservado' },
  { id: '005', name: 'David Pérez',    phone: '555-7890', date: '2026-02-28', time: '20:00', persons: 4, table: 4, status: 'reservado' },
  { id: '006', name: 'Ana González',   phone: '555-2468', date: '2026-02-28', time: '19:30', persons: 2, table: 6, status: 'reservado' },
  { id: '007', name: 'Luis Herrera',   phone: '555-1111', date: '2026-03-02', time: '20:00', persons: 6, table: 9, status: 'reservado' },
  { id: '008', name: 'Paula Ruiz',     phone: '555-2222', date: '2026-03-01', time: '14:00', persons: 2, table: 1, status: 'reservado' },
]

export const STATS_CONFIG = [
  { emoji: '📆', label: 'Reservas Hoy',        key: 'reservasHoy',      variant: 'accent'  },
  { emoji: '🔒', label: 'Total Reservadas',     key: 'mesasReservadas',  variant: 'default' },
  { emoji: '✓',  label: 'Disponibles Hoy',      key: 'mesasDisponibles', variant: 'dark'    },
  { emoji: '📅', label: 'Total esta semana',    key: 'totalSemana',      variant: 'default' },
]

