export function cx(...args) {
  return args
    .flatMap(a =>
      Array.isArray(a) ? a :
      typeof a === 'object' && a !== null
        ? Object.entries(a).filter(([, v]) => v).map(([k]) => k)
        : [a]
    )
    .filter(Boolean)
    .join(' ')
}
