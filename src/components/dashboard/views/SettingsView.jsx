import { useCallback } from 'react'
import Button from '../../ui/Button.jsx'
import FormField from '../../ui/FormField.jsx'
import { useSettings, DEFAULT_SETTINGS } from '../../../context/SettingsContext.jsx'
import { TOTAL_TABLES } from '../../../constants/reservations.js'

export default function SettingsView() {
  const { settings, updateSettings, resetSettings } = useSettings()

  const set = useCallback(
    (key) => (e) => {
      const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value
      updateSettings(prev => ({ ...prev, [key]: val }))
    },
    [updateSettings]
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white tracking-tight">Configuración ⚙️</h1>
        <p className="text-ink-soft dark:text-ink-ghost mt-1">Ajusta los parámetros de tu restaurante</p>
      </div>

      <div className="bg-surface dark:bg-dark-surface rounded-xl2 p-8 shadow-sm2 space-y-8">
        <section>
          <h3 className="text-base font-black text-ink dark:text-white mb-5">🏪 Información del Restaurante</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Nombre"    id="s-name"    value={settings.name}    onChange={set('name')}    />
            <FormField label="Email"     id="s-email"   type="email" value={settings.email}   onChange={set('email')}   />
            <FormField label="Teléfono"  id="s-phone"   type="tel"   value={settings.phone}   onChange={set('phone')}   />
            <FormField label="Dirección" id="s-address" value={settings.address} onChange={set('address')} />
          </div>
        </section>

        <div className="h-px bg-border-col dark:bg-dark-border" />

        <section>
          <h3 className="text-base font-black text-ink dark:text-white mb-5">🕐 Horarios y Capacidad</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Apertura"                id="s-open"     type="time"   value={settings.open}     onChange={set('open')}     />
            <FormField label="Cierre"                  id="s-close"    type="time"   value={settings.close}    onChange={set('close')}    />
            <FormField label="Número de mesas totales" id="s-tables" type="number" value={TOTAL_TABLES} readOnly disabled />
          </div>
          <p className="text-xs text-ink-ghost dark:text-ink-ghost mt-3">
            ⚠️ El número de mesas se calcula de manera automática basado en la configuración maestra de zonas y locaciones.
          </p>
        </section>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={resetSettings}>Restaurar defaults</Button>
          <Button variant="gold">💾 Guardar Cambios</Button>
        </div>
      </div>
    </div>
  )
}
