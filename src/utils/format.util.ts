/** Redondea a `decimals` cifras evitando los errores de coma flotante acumulados. */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function formatScore(value: number, decimals = 2): string {
  return value.toFixed(decimals)
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${round(value, decimals).toFixed(decimals)} %`
}

/** Limita un numero al rango [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
