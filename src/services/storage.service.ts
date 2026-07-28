import { env } from '@/config/env'

/**
 * Envoltura tipada sobre LocalStorage. Es la unica capa que conoce el navegador,
 * de modo que cambiar la persistencia (API REST, IndexedDB) solo afecta a este archivo.
 */
export class StorageService {
  private readonly prefix: string

  constructor(prefix: string = env.storagePrefix) {
    this.prefix = prefix
  }

  key(collection: string): string {
    return `${this.prefix}:${collection}`
  }

  read<T>(collection: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(this.key(collection))
      return raw === null ? fallback : (JSON.parse(raw) as T)
    } catch (error) {
      console.error(`[storage] No se pudo leer "${collection}"`, error)
      return fallback
    }
  }

  write<T>(collection: string, value: T): void {
    try {
      window.localStorage.setItem(this.key(collection), JSON.stringify(value))
    } catch (error) {
      console.error(`[storage] No se pudo escribir "${collection}"`, error)
    }
  }

  has(collection: string): boolean {
    return window.localStorage.getItem(this.key(collection)) !== null
  }

  remove(collection: string): void {
    window.localStorage.removeItem(this.key(collection))
  }

  /** Borra unicamente las claves creadas por la aplicacion. */
  clear(): void {
    const ownKeys = Object.keys(window.localStorage).filter((key) =>
      key.startsWith(`${this.prefix}:`),
    )
    ownKeys.forEach((key) => window.localStorage.removeItem(key))
  }
}

export const storage = new StorageService()
