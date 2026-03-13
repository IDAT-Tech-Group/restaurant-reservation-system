// Utility functions for time overlapping and duration calculation

/**
 * Convierte un formato de hora "HH:MM" a minutos totales del día
 * @param {string} timeStr - Ej. "14:30"
 * @returns {number} Minutos
 */
export function timeToMinutes(timeStr) {
  if (!timeStr) return 0
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

/**
 * Suma minutos a una hora y la devuelve en "HH:MM"
 * @param {string} timeStr - Ej. "14:30"
 * @param {number} minutesToAdd - Ej. 60
 * @returns {string} Ej. "15:30"
 */
export function addTime(timeStr, minutesToAdd) {
  if (!timeStr) return ''
  const total = timeToMinutes(timeStr) + minutesToAdd
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Comprueba si dos rangos de tiempo se cruzan.
 * Si uno termina a las 14:00 y el otro empieza a las 14:00, NO se cruzan (return false).
 */
export function isOverlapping(startA, endA, startB, endB) {
  const sA = timeToMinutes(startA)
  const eA = timeToMinutes(endA)
  const sB = timeToMinutes(startB)
  const eB = timeToMinutes(endB)

  // Condición de solapamiento: A empieza antes de que B termine, Y B empieza antes de que A termine
  return sA < eB && sB < eA
}
