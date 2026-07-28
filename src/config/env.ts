/**
 * Unico punto de lectura de `import.meta.env`.
 * Regla del proyecto: ningun otro archivo puede leer variables de entorno directamente.
 */
interface AppEnvironment {
  readonly appName: string
  readonly storagePrefix: string
  readonly seedVersion: string
  readonly maxGrade: number
  readonly minGrade: number
  readonly passingGrade: number
}

function readString(value: string | undefined, fallback: string): string {
  return value !== undefined && value.trim() !== '' ? value.trim() : fallback
}

function readNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env: AppEnvironment = {
  appName: readString(import.meta.env.VITE_APP_NAME, 'Notium'),
  storagePrefix: readString(import.meta.env.VITE_STORAGE_PREFIX, 'notium'),
  seedVersion: readString(import.meta.env.VITE_SEED_VERSION, '1'),
  maxGrade: readNumber(import.meta.env.VITE_MAX_GRADE, 5),
  minGrade: readNumber(import.meta.env.VITE_MIN_GRADE, 0),
  passingGrade: readNumber(import.meta.env.VITE_PASSING_GRADE, 3),
}
