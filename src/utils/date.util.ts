const DATE_FORMATTER = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('es-CO', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function nowIso(): string {
  return new Date().toISOString()
}

/** Fecha de hoy en formato YYYY-MM-DD, apto para `<input type="date">`. */
export function todayInputValue(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : DATE_FORMATTER.format(date)
}

/** Formato compacto para celdas de tabla, donde el ancho es escaso. */
export function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : SHORT_DATE_FORMATTER.format(date)
}

export function formatDateTime(isoDate: string): string {
  const date = new Date(isoDate)
  return Number.isNaN(date.getTime()) ? '—' : DATE_TIME_FORMATTER.format(date)
}
