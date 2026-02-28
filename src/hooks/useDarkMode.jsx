import { useContext } from 'react'
import { DarkModeContext } from '../context/DarkModeContext.jsx'

export function useDarkMode() {
  return useContext(DarkModeContext)
}
