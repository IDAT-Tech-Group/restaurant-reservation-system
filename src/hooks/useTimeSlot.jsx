import { useState, useCallback } from 'react'

export function useTimeSlot() {
  const [selected, setSelected] = useState(null)
  const select = useCallback(time => setSelected(time), [])
  const reset = useCallback(() => setSelected(null), [])
  return { selected, select, reset }
}
