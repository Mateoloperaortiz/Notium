import { ref } from 'vue'
import type { Ref } from 'vue'

import type { BaseEntity, EntityDraft, EntityPatch } from '@/models'
import type { BaseRepository } from '@/repositories'

export interface EntityCollection<T extends BaseEntity> {
  items: Ref<T[]>
  refresh: () => void
  create: (draft: EntityDraft<T>) => T
  update: (id: string, patch: EntityPatch<T>) => T | null
  remove: (id: string) => boolean
  removeWhere: (predicate: (item: T) => boolean) => number
  findById: (id: string) => T | null
}

/**
 * Puente reactivo entre un repositorio de LocalStorage y los stores de Pinia.
 * Evita repetir el mismo CRUD en los cuatro stores de dominio (DRY).
 */
export function useEntityCollection<T extends BaseEntity>(
  repository: BaseRepository<T>,
): EntityCollection<T> {
  const items = ref<T[]>([]) as Ref<T[]>

  function refresh(): void {
    items.value = repository.list()
  }

  function create(draft: EntityDraft<T>): T {
    const created = repository.create(draft)
    refresh()
    return created
  }

  function update(id: string, patch: EntityPatch<T>): T | null {
    const updated = repository.update(id, patch)
    refresh()
    return updated
  }

  function remove(id: string): boolean {
    const removed = repository.remove(id)
    refresh()
    return removed
  }

  function removeWhere(predicate: (item: T) => boolean): number {
    const count = repository.removeWhere(predicate)
    refresh()
    return count
  }

  function findById(id: string): T | null {
    return items.value.find((item) => item.id === id) ?? null
  }

  refresh()

  return { items, refresh, create, update, remove, removeWhere, findById }
}
