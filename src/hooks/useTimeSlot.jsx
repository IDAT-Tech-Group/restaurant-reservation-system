import { useState, useCallback } from 'react'

export function useTimeSlot() {
  const [startTime, setStartTime] = useState(null)
  const [duration, setDuration]   = useState(120) // Default 2 hours

  const selectTime = useCallback(time => setStartTime(time), [])
  const changeDuration = useCallback(mins => setDuration(mins), [])
  const reset = useCallback(() => {
    setStartTime(null)
    setDuration(120)
  }, [])

  return { startTime, duration, selectTime, changeDuration, reset }
}
