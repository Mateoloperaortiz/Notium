/** Paleta semantica compartida por insignias, tarjetas y celdas de tabla. */
export type Tone = 'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'

/** Clases de Tailwind escritas completas para que el compilador pueda detectarlas. */
const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  brand: 'bg-brand-100 text-brand-800 ring-brand-200',
  info: 'bg-sky-100 text-sky-800 ring-sky-200',
  success: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  warning: 'bg-amber-100 text-amber-800 ring-amber-200',
  danger: 'bg-rose-100 text-rose-800 ring-rose-200',
}

const TONE_HEX: Record<Tone, string> = {
  neutral: '#8791a8',
  brand: '#3b66f6',
  info: '#0ea5e9',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#f43f5e',
}

export function toneClasses(tone: Tone): string {
  return TONE_CLASSES[tone]
}

export function toneHex(tone: Tone): string {
  return TONE_HEX[tone]
}

/** Traduce una nota a un tono: rojo por debajo del minimo, verde en el rango alto. */
export function scoreTone(score: number, passingGrade: number, maxGrade: number): Tone {
  if (score <= 0) {
    return 'neutral'
  }
  if (score < passingGrade) {
    return 'danger'
  }
  return score >= (passingGrade + maxGrade) / 2 ? 'success' : 'warning'
}
