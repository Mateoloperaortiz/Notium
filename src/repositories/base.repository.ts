import type { BaseEntity, EntityDraft, EntityPatch } from '@/models'
import { storage } from '@/services/storage.service'
import { nowIso } from '@/utils/date.util'
import { createId } from '@/utils/id.util'

/**
 * CRUD generico sobre una coleccion de LocalStorage.
 * Cada repositorio concreto solo agrega las consultas propias de su entidad (DRY).
 */
export abstract class BaseRepository<T extends BaseEntity> {
  protected readonly collection: string

  protected constructor(collection: string) {
    this.collection = collection
  }

  list(): T[] {
    return storage.read<T[]>(this.collection, [])
  }

  findById(id: string): T | null {
    return this.list().find((item) => item.id === id) ?? null
  }

  findBy(predicate: (item: T) => boolean): T[] {
    return this.list().filter(predicate)
  }

  create(draft: EntityDraft<T>): T {
    const timestamp = nowIso()
    const entity = {
      ...draft,
      id: createId(),
      createdAt: timestamp,
      updatedAt: timestamp,
    } as T

    this.saveAll([...this.list(), entity])
    return entity
  }

  update(id: string, patch: EntityPatch<T>): T | null {
    const items = this.list()
    const index = items.findIndex((item) => item.id === id)
    if (index === -1) {
      return null
    }

    const updated = { ...items[index], ...patch, updatedAt: nowIso() } as T
    items[index] = updated
    this.saveAll(items)
    return updated
  }

  remove(id: string): boolean {
    const items = this.list()
    const remaining = items.filter((item) => item.id !== id)
    if (remaining.length === items.length) {
      return false
    }

    this.saveAll(remaining)
    return true
  }

  /** Borrado masivo usado por las eliminaciones en cascada. */
  removeWhere(predicate: (item: T) => boolean): number {
    const items = this.list()
    const remaining = items.filter((item) => !predicate(item))
    this.saveAll(remaining)
    return items.length - remaining.length
  }

  saveAll(items: T[]): void {
    storage.write(this.collection, items)
  }
}
