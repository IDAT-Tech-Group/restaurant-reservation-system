import { useState, useMemo } from 'react'
import { useReservations } from '../../../context/ReservationsContext.jsx'
import { fetchApi } from '../../../services/api.js'
import Button from '../../ui/Button.jsx'

const EMPTY_FORM = { number: '', capacity: '', zone_id: '' }

export default function TablesView() {
  const { tables, zones, fetchData } = useReservations()
  const [editingTable, setEditingTable]   = useState(null)
  const [isModalOpen,  setIsModalOpen]    = useState(false)
  const [form,         setForm]           = useState(EMPTY_FORM)
  const [error,        setError]          = useState('')
  const [saving,       setSaving]         = useState(false)
  const [zoneFilter,   setZoneFilter]     = useState('')

  const filtered = useMemo(() =>
    (tables || []).filter(t => !zoneFilter || String(t.zone_id ?? t.zone) === String(zoneFilter))
  , [tables, zoneFilter])

  const openCreate = () => {
    setEditingTable(null)
    setForm(EMPTY_FORM)
    setError('')
    setIsModalOpen(true)
  }

  const openEdit = (t) => {
    setEditingTable(t)
    setForm({
      number:   String(t.number ?? ''),
      capacity: String(t.capacity ?? ''),
      zone_id:  String(t.zone_id ?? t.zone ?? ''),
    })
    setError('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTable(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.number || !form.capacity || !form.zone_id) {
      setError('Todos los campos son obligatorios')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        number:   Number(form.number),
        capacity: Number(form.capacity),
        zone_id:  form.zone_id,
      }
      if (editingTable) {
        await fetchApi(`/mesas/${editingTable.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        await fetchApi('/mesas', { method: 'POST', body: JSON.stringify(payload) })
      }
      await fetchData()
      closeModal()
    } catch (err) {
      setError(err.message || 'Error al guardar la mesa')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar esta mesa? Esta acción no se puede deshacer.')) return
    try {
      await fetchApi(`/mesas/${id}`, { method: 'DELETE' })
      await fetchData()
    } catch (err) {
      alert(err.message || 'Error al eliminar')
    }
  }

  const getZoneName = (t) => {
    const zid = t.zone_id ?? t.zone
    return zones.find(z => String(z.id) === String(zid))?.name || 'Sin zona'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Mesas 🪑</h1>
          <p className="text-ink-soft dark:text-ink-ghost mt-1">{filtered.length} mesa{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="gold" onClick={openCreate}>+ Nueva Mesa</Button>
      </div>

      {/* Filtro por zona */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl p-5 shadow-sm flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-black uppercase tracking-widest text-ink-ghost">Zona</label>
          <select
            value={zoneFilter}
            onChange={e => setZoneFilter(e.target.value)}
            className="bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-lg px-3 py-2 text-sm text-ink dark:text-white outline-none"
          >
            <option value="">Todas las zonas</option>
            {zones.map(z => (
              <option key={z.id} value={String(z.id)}>{z.icon} {z.name}</option>
            ))}
          </select>
        </div>
        {zoneFilter && (
          <button
            onClick={() => setZoneFilter('')}
            className="text-xs text-ink-ghost hover:text-ink dark:hover:text-white border-0 bg-transparent cursor-pointer pb-2"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-surface dark:bg-dark-surface rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="border-b border-border-col dark:border-dark-border">
              <tr>
                {['ID', 'Número', 'Zona', 'Capacidad', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-ink-ghost">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-ink-ghost text-sm">
                    No hay mesas registradas
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="border-b border-border-col dark:border-dark-border last:border-0 hover:bg-bg dark:hover:bg-dark-bg transition-colors">
                    <td className="px-5 py-4 text-sm font-black text-ink-ghost">#{t.id}</td>
                    <td className="px-5 py-4 text-sm font-bold text-ink dark:text-white">Mesa {t.number}</td>
                    <td className="px-5 py-4 text-sm text-ink-soft dark:text-ink-ghost">
                      {zones.find(z => String(z.id) === String(t.zone_id ?? t.zone))?.icon || ''} {getZoneName(t)}
                    </td>
                    <td className="px-5 py-4 text-sm text-ink dark:text-white">
                      <span className="bg-gold/15 text-gold-dark dark:text-gold px-2.5 py-1 rounded-md font-bold text-xs">
                        {t.capacity} pax
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${t.is_active !== false ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'}`}>
                        {t.is_active !== false ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-5 py-4 flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(t)}>✏️ Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>Eliminar</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-2xl w-full max-w-md p-8">
            <h2 className="text-2xl font-black text-ink dark:text-white mb-6">
              {editingTable ? `Editar Mesa ${editingTable.number}` : 'Nueva Mesa'}
            </h2>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              {/* Número */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-ink-ghost">Número de mesa</label>
                <input
                  name="number"
                  type="number"
                  min="1"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Ej: 12"
                  className="bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-lg px-4 py-2.5 text-sm text-ink dark:text-white outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* Zona */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-ink-ghost">Zona</label>
                <select
                  name="zone_id"
                  value={form.zone_id}
                  onChange={handleChange}
                  className="bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-lg px-4 py-2.5 text-sm text-ink dark:text-white outline-none focus:border-gold transition-colors"
                >
                  <option value="">Selecciona una zona…</option>
                  {zones.map(z => (
                    <option key={z.id} value={String(z.id)}>{z.icon} {z.name}</option>
                  ))}
                </select>
              </div>

              {/* Capacidad */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-ink-ghost">Capacidad (pax)</label>
                <input
                  name="capacity"
                  type="number"
                  min="1"
                  max="20"
                  value={form.capacity}
                  onChange={handleChange}
                  placeholder="Ej: 4"
                  className="bg-bg dark:bg-dark-bg border border-border-col dark:border-dark-border rounded-lg px-4 py-2.5 text-sm text-ink dark:text-white outline-none focus:border-gold transition-colors"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-semibold">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border-col dark:border-dark-border text-sm font-bold text-ink-soft dark:text-ink-ghost hover:bg-bg dark:hover:bg-dark-bg transition-colors bg-transparent cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gold text-ink text-sm font-black hover:bg-gold-dark transition-colors cursor-pointer border-0 disabled:opacity-50"
                >
                  {saving ? 'Guardando…' : editingTable ? 'Guardar cambios' : 'Crear mesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
