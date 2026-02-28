import { useState, useMemo } from 'react'
import Button from '../../ui/Button.jsx'
import Badge from '../../ui/Badge.jsx'
import FormField from '../../ui/FormField.jsx'
import NewReservationModal from '../NewReservationModal.jsx'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { STATUS_LABEL } from '../../../constants/reservations.js'

const formatDate = (isoDate) => {
  const [y, m, d] = isoDate.split('-')
  return `${d}/${m}/${y}`
}

export default function ReservationsView() {
  const { reservations, releaseTable } = useReservations()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm,  setSearchTerm]  = useState('')
  const [dateFilter,  setDateFilter]  = useState('')

  const filtered = useMemo(() =>
    reservations.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.phone.includes(searchTerm)
      const matchDate   = !dateFilter || r.date === dateFilter
      return matchSearch && matchDate
    })
  , [reservations, searchTerm, dateFilter])

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
                {['#', 'Cliente', 'Teléfono', 'Fecha', 'Hora', 'Pers.', 'Mesa', 'Estado', 'Acciones'].map(h => (
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
                    <td className="px-5 py-4 text-sm font-semibold text-ink dark:text-white">{r.name}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{r.phone}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{formatDate(r.date)}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">{r.time}</td>
                    <td className="px-5 py-4 text-sm text-ink dark:text-white">{r.persons}</td>
                    <td className="px-5 py-4 text-sm font-bold text-ink dark:text-white">
                      {r.table === 'auto' ? 'Auto' : `Mesa ${r.table}`}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="green">{STATUS_LABEL}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Button variant="danger" size="sm" className="text-xs" onClick={() => releaseTable(r.id)}>
                        Liberar mesa
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
