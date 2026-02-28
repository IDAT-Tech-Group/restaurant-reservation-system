import { useState, useCallback } from 'react'

const MIN_PERSONS = 1
const MAX_PERSONS = 20
const DEFAULT_PERSONS = 2

export function usePersonCount() {
  const [count, setCount] = useState(DEFAULT_PERSONS)
  const increment = useCallback(() => setCount(c => Math.min(c + 1, MAX_PERSONS)), [])
  const decrement = useCallback(() => setCount(c => Math.max(c - 1, MIN_PERSONS)), [])
  const reset = useCallback(() => setCount(DEFAULT_PERSONS), [])
  return { count, increment, decrement, reset }
}
