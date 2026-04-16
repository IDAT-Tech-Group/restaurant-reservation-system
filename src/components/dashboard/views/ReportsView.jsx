import { useMemo, useState } from 'react'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts'
import { cx } from '../../../lib/cx.js'

const COLORS = ['#FFD700', '#FF8C00', '#FF1493', '#00CED1', '#4169E1', '#8A2BE2']

/**
 * Función auxiliar para obtener las fechas de los últimos N días
 */
function getLastNDays(n) {
  const dates = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    // format YYYY-MM-DD
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    dates.push(`${y}-${m}-${dd}`)
  }
  return dates
}

// Tooltip personalizado para mantener la estética oscura/glassmorphism
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface dark:bg-dark-surface border border-border-col dark:border-dark-border p-3 rounded-xl shadow-lg2 text-sm">
        <p className="font-bold text-ink dark:text-white mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-ink-soft dark:text-ink-ghost capitalize">{entry.name}:</span>
            <span className="text-gold-dark dark:text-gold">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const RANGES = [
  { label: '7 Días', value: 7 },
  { label: '1 Mes', value: 30 },
  { label: '3 Meses', value: 90 },
  { label: '6 Meses', value: 180 }
]

export default function ReportsView() {
  const { reservations, zones } = useReservations()
  const [daysRange, setDaysRange] = useState(7)

  // 1. HORARIOS MÁS CALIENTES
  const peakHoursData = useMemo(() => {
    const counts = {}
    reservations.forEach(r => {
      const time = r.startTime || r.start_time || r.time
      if (!time) return
      const hour = time.substring(0, 2) + ':00' // Agrupar por hora exacta
      counts[hour] = (counts[hour] || 0) + 1
    })
    
    return Object.keys(counts)
      .sort((a, b) => a.localeCompare(b))
      .map(time => ({
        time,
        reservas: counts[time]
      }))
  }, [reservations])

  // 2. ZONAS MÁS POPULARES
  const zoneData = useMemo(() => {
    const counts = {}
    reservations.forEach(r => {
      // Intentar obtener el nombre de la zona, sino usar el ID
      let zName = r.zone_name || r.zone
      // Si la zona es solo un ID, buscamos el nombre en el contexto de zones
      if (typeof zName === 'number' && zones && zones.length > 0) {
        const found = zones.find(z => z.id === zName)
        if (found) zName = found.name
      }
      if (!zName) zName = 'Sin Zona'
      
      counts[zName] = (counts[zName] || 0) + 1
    })

    return Object.keys(counts)
      .map(name => ({ name, value: counts[name] }))
      .sort((a,b) => b.value - a.value) // Mostrar la más popular primero
  }, [reservations, zones])

  // 3. TENDENCIA DE RESERVAS ÚLTIMOS N DÍAS
  const trendData = useMemo(() => {
    const lastNDays = getLastNDays(daysRange)
    const counts = {}
    
    // Inicializar los N días con 0
    lastNDays.forEach(d => { counts[d] = { pendientes: 0, cancelados: 0, total: 0 } })

    reservations.forEach(r => {
      if (counts[r.date] !== undefined) {
        counts[r.date].total += 1
        if (r.status === 'cancelado') {
          counts[r.date].cancelados += 1
        } else {
          counts[r.date].pendientes += 1
        }
      }
    })

    return lastNDays.map(date => {
      // Formato bonito de fecha (ej. "16 Abr")
      const d = new Date(date + 'T12:00:00') // Evitar bugs de timezone
      const label = d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      return {
        dateLabel: label,
        Asistencias: counts[date].pendientes, // Agrupamos todo lo no cancelado como "Asistencias" o "Válidas"
        Cancelaciones: counts[date].cancelados
      }
    })
  }, [reservations, daysRange])

  // 4. MESAS MÁS SOLICITADAS (Top 5)
  const topTablesData = useMemo(() => {
    const counts = {}
    reservations.forEach(r => {
      const t = r.table || r.table_id || 'Auto'
      counts[t] = (counts[t] || 0) + 1
    })

    return Object.keys(counts)
      .map(table => ({ name: `Mesa ${table}`, Reservas: counts[table] }))
      .sort((a, b) => b.Reservas - a.Reservas)
      .slice(0, 5) // Top 5
  }, [reservations])


  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Reportes y Estadísticas 📈</h1>
        <p className="text-ink-soft dark:text-ink-ghost mt-1">
          Visualiza el rendimiento y demanda del restaurante en tiempo real.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-surface dark:bg-dark-surface rounded-xl p-10 text-center shadow-sm">
          <span className="text-4xl">📭</span>
          <p className="mt-3 font-bold text-ink-soft dark:text-ink-ghost">
            No hay suficientes datos para generar reportes aún.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* TREND CHART */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2 col-span-1 lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-lg font-black text-ink dark:text-white">Tendencia Histórica</h2>
              <div className="flex bg-bg dark:bg-dark-bg p-1 rounded-xl">
                {RANGES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setDaysRange(r.value)}
                    className={cx(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-0 cursor-pointer',
                      daysRange === r.value 
                        ? 'bg-ink dark:bg-white text-white dark:text-ink shadow-sm'
                        : 'text-ink-soft dark:text-ink-ghost bg-transparent hover:text-ink dark:hover:text-white hover:bg-ink/5 dark:hover:bg-white/5'
                    )}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.15} vertical={false} />
                  <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} minTickGap={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Asistencias" stroke="#FFD700" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, stroke: '#fff' }} />
                  <Line type="monotone" dataKey="Cancelaciones" stroke="#FF4500" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PEAK HOURS */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2">
            <h2 className="text-lg font-black text-ink dark:text-white mb-6">Demanda por Horario</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={peakHoursData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.1} vertical={false} />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,215,0, 0.05)' }} />
                  <Bar dataKey="reservas" fill="#FFD700" radius={[6, 6, 0, 0]} name="Reservas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ZONES DISTRIBUTION */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2">
            <h2 className="text-lg font-black text-ink dark:text-white mb-6">Zonas Preferidas</h2>
            <div className="flex items-center h-64">
              <div className="w-1/2 h-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={zoneData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {zoneData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Leyenda manual con estilos */}
              <div className="w-1/2 flex flex-col gap-3 pl-4">
                {zoneData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-bold text-ink-soft dark:text-ink-ghost line-clamp-1 flex-1">
                      {entry.name}
                    </span>
                    <span className="text-sm font-black text-ink dark:text-white">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TOP TABLES */}
          <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-6 shadow-sm2">
            <h2 className="text-lg font-black text-ink dark:text-white mb-6">Mesas Top (Más Solicitadas)</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={topTablesData} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.1} horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#aaa', fontWeight: 'bold' }} width={60} />
                  <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,215,0, 0.05)' }} />
                  <Bar dataKey="Reservas" fill="#8A2BE2" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
