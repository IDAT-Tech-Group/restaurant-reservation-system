import { ZONES } from '../../constants/reservations.js'

export default function SuccessModal({ booking, onClose }) {
  const d = new Date((booking.date || '') + 'T12:00:00')
  const dateStr = d.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const zoneObj = ZONES.find(z => z.id === booking.zone)
  const zoneName = zoneObj ? zoneObj.name : booking.zone

  const rows = [
    ['👤 Nombre', booking.name],
    ['📅 Fecha', dateStr],
    ['🕐 Horario', `${booking.startTime} a ${booking.endTime}`],
    ['📍 Zona', zoneName],
    ['🪑 Mesa', `Mesa ${booking.table}`],
    ['👥 Personas', `${booking.persons} persona${booking.persons > 1 ? 's' : ''}`],
    ['📧 Confirmación', booking.email || booking.phone],
    booking.notes && ['📝 Notas', booking.notes],
  ].filter(Boolean)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-9 w-11/12 max-w-md shadow-lg2 text-center animate-[popIn_.25s_ease]" onClick={e => e.stopPropagation()}>
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/50 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 animate-pulse">⏳</div>
        <h2 className="text-2xl font-black text-ink dark:text-white mb-2">Reserva pre-registrada</h2>
        <p className="text-sm text-ink-soft dark:text-ink-ghost mb-6">Esta reserva se encuentra <b>PENDIENTE</b>.<br/>Te enviamos un correo con los pasos a seguir.</p>
        <div className="bg-bg dark:bg-dark-bg rounded-xl p-4 mb-6 text-left flex flex-col gap-3">
          {rows.map(([key, val]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-ink-soft dark:text-ink-ghost font-semibold">{key}</span>
              <span className="text-ink dark:text-white font-bold text-right max-w-[55%]">{val}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-ink-ghost mb-4 bg-orange-50 dark:bg-orange-900/10 p-3 rounded-lg border border-orange-200 dark:border-orange-900/40">
          ⚠️ <b>Paso requerido:</b> Para garantizar tu mesa, debes abonar el 50% del consumo base en tu panel de <a href="#/my-reservations" className="text-gold font-bold underline">Mis Reservas</a>.
        </div>
        <button onClick={onClose} className="w-full py-3 bg-gold text-ink font-black rounded-pill border-0 cursor-pointer hover:bg-gold-dark transition-colors">
          Entendido, ir a pagar 💳
        </button>
      </div>
    </div>
  )
}
