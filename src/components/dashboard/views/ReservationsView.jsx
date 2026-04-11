import { useState, useMemo } from 'react'
import Button from '../../ui/Button.jsx'
import Badge from '../../ui/Badge.jsx'
import FormField from '../../ui/FormField.jsx'
import NewReservationModal from '../NewReservationModal.jsx'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { ZONES } from '../../../constants/reservations.js'

const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

export default function ReservationsView() {
  const { reservations, releaseTable, updateReservationStatus } = useReservations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm,  setSearchTerm]  = useState('')
  const [dateFilter,  setDateFilter]  = useState('')

  const filtered = useMemo(() =>
    reservations.filter(r => {
      const cName = r.user?.name || r.name || '';
      const cPhone = r.user?.phone || r.phone || '';
      const matchSearch = cName.toLowerCase().includes(searchTerm.toLowerCase()) || cPhone.includes(searchTerm)
      const matchDate   = !dateFilter || r.date === dateFilter
      return matchSearch && matchDate
    })
  , [reservations, searchTerm, dateFilter])

  const STATUS_STYLES = {
    pendiente: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
    reservado: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
    completado: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
    cancelado: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
  }

  const renderStatusSelect = (r) => {
    return (
      <select
        value={r.status}
        onChange={(e) => updateReservationStatus(r.id, e.target.value)}
        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-pill text-xs font-bold tracking-wide outline-none cursor-pointer appearance-none border-0 text-center ${STATUS_STYLES[r.status] || STATUS_STYLES.pendiente}`}
        style={{ paddingRight: '0.75rem' }}
      >
        <option value="pendiente" className="text-ink dark:text-white bg-surface dark:bg-dark-surface font-sans">⏳ Pendiente</option>
        <option value="reservado" className="text-ink dark:text-white bg-surface dark:bg-dark-surface font-sans">🔒 Reservado</option>
        <option value="completado" className="text-ink dark:text-white bg-surface dark:bg-dark-surface font-sans">✅ Completado</option>
        <option value="cancelado" className="text-ink dark:text-white bg-surface dark:bg-dark-surface font-sans">❌ Cancelado</option>
      </select>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Reservas 📋</h1>
          <p className="text-ink-soft dark:text-ink-ghost mt-1">{filtered.length} reservas encontradas</p>
        </div>
        <Button variant="gold" onClick={() => setIsModalOpen(true)}>+ Nueva Reserva</Button>
      </div>

      {/* Filtros */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-5 shadow-sm2 flex flex-wrap gap-4 items-end">
        <FormField
          label="Buscar"
          id="r-search"
          placeholder="Nombre o teléfono…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <div className="flex items-end gap-2">
          <FormField
            label="Fecha"
            id="r-date"
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
          {dateFilter && (
            <Button variant="ghost" size="sm" onClick={() => setDateFilter('')}>✕</Button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl2 overflow-hidden shadow-sm2">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-border-col dark:border-dark-border">
              <tr>
                {['#', 'Cliente', 'Teléfono', 'Fecha', 'Hora', 'Pers.', 'Zona', 'Mesa', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-ink-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-ink-ghost dark:text-ink-ghost text-sm">
                    No hay reservas que coincidan con los filtros
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-b border-border-col dark:border-dark-border last:border-0 hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-4 text-sm font-black text-ink dark:text-white">{r.id}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-ink dark:text-white">{r.user?.name || r.name}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{r.user?.phone || r.phone}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{formatDate(r.date)}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{r.startTime || r.start_time} - {r.endTime || r.end_time}</td>
                    <td className="px-5 py-4 text-sm text-ink dark:text-white">{r.persons}</td>
                    <td className="px-5 py-4 text-xs font-bold text-ink-soft dark:text-ink-ghost uppercase">
                      {ZONES.find(z => z.id === (r.zone || r.zone_id || r.table?.zone_id))?.name || 'General'}
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-ink dark:text-white">
                      {(r.table?.number || r.table_id || r.table) === 'auto' ? 'Auto' : `Mesa ${r.table?.number || r.table_id || r.table}`}
                    </td>
                    <td className="px-5 py-4">
                      {renderStatusSelect(r)}
                    </td>
                    <td className="px-5 py-4">

                      <Button variant="danger" size="sm" className="text-xs" onClick={() => releaseTable(r.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
