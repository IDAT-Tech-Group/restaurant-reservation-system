import { createContext, useState, useCallback, useEffect } from 'react'

export const DarkModeContext = createContext(null)

export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('rf-dark')
    if (stored !== null) return JSON.parse(stored)
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('rf-dark', JSON.stringify(isDark))
  }, [isDark])

  const toggle = useCallback(() => setIsDark(d => !d), [])

  return (
    <DarkModeContext.Provider value={{ isDark, toggle }}>
      {children}
    </DarkModeContext.Provider>
  )
}
