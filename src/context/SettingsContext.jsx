import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const SettingsContext = createContext(null)

export const DEFAULT_SETTINGS = {
  name:    'Mi Restaurante Premium',
  email:   'admin@mirestaurante.com',
  phone:   '+1 (555) 123-4567',
  address: 'Av. Principal 123',
  open:    '11:00',
  close:   '23:00',
  tables:  15,
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  const updateSettings = useCallback((next) => setSettings(next), [])
  const resetSettings  = useCallback(() => setSettings(DEFAULT_SETTINGS), [])

  const tableNumbers = useMemo(
    () => Array.from({ length: settings.tables }, (_, i) => i + 1),
    [settings.tables]
  )

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, tableNumbers }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings debe usarse dentro de SettingsProvider')
  return ctx
}
