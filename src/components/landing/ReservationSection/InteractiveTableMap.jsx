import { cx } from '../../../lib/cx.js'

/**
 * Componente visual para mostrar las mesas disponibles y elegir una.
 */
export default function InteractiveTableMap({ 
  availableTables, 
  selectedTableId, 
  onSelectTable, 
  requiredPersons 
}) {

  if (!availableTables || availableTables.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-red-300 dark:border-red-900/40 rounded-xl bg-red-50 dark:bg-red-900/10">
        <span className="text-3xl mb-2 block">😟</span>
        <p className="font-bold text-red-600 dark:text-red-400">Restaurante Lleno</p>
        <p className="text-xs text-red-500 mt-1">No hay mesas disponibles para este horario y zona. Intenta elegir otro turno.</p>
      </div>
    )
  }

  // Filtrar mesas que puedan alojar a las personas
  const fittingTables = availableTables.filter(t => t.capacity >= requiredPersons)

  if (fittingTables.length === 0) {
    return (
      <div className="p-6 text-center border-2 border-dashed border-gold/40 rounded-xl bg-gold/5">
        <span className="text-3xl mb-2 block">🪑</span>
        <p className="font-bold text-ink dark:text-white">Sin Mesas Grandes</p>
        <p className="text-xs text-ink-ghost mt-1">Hay mesas libres, pero ninguna con capacidad para {requiredPersons} personas. Sugerimos llamar al restaurante.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-3">
        {fittingTables.map(t => {
          const isSelected = selectedTableId === t.id
          
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTable(t.id)}
              className={cx(
                'relative flex flex-col items-center justify-center h-20 rounded-xl border-2 transition-all cursor-pointer overflow-hidden',
                isSelected 
                  ? 'bg-gold border-gold text-ink shadow-md scale-105' 
                  : 'bg-bg dark:bg-dark-bg border-border-col dark:border-dark-border text-ink dark:text-white hover:border-gold/50'
              )}
            >
              <div className="text-2xl mb-1">🪑</div>
              <div className="font-black leading-none text-sm">Mesa {t.id}</div>
              <div className={cx("text-[10px] mt-1 font-semibold", isSelected ? 'text-ink/60' : 'text-ink-ghost')}>
                Max. {t.capacity} pax
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
