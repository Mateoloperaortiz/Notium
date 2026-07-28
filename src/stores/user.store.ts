import { defineStore } from 'pinia'
import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import type { PublicUser, User, UserRole } from '@/models'
import { userRepository } from '@/repositories'
import { useEntityCollection } from '@/composables/useEntityCollection'
import { authService, toPublicUser } from '@/services/auth.service'
import { useSemesterStore } from './semester.store'

export interface UserInput {
  name: string
  email: string
  role: UserRole
  /** Opcional al editar: si viene vacio se conserva la contrasena actual. */
  password?: string
}

export type UserMutationResult = { ok: true; user: PublicUser } | { ok: false; error: string }

interface UserStore {
  items: Ref<User[]>
  publicUsers: ComputedRef<PublicUser[]>
  refresh: () => void
  findById: (id: string) => User | null
  createUser: (input: UserInput) => Promise<UserMutationResult>
  updateUser: (id: string, input: UserInput) => Promise<UserMutationResult>
  /** Elimina el usuario junto con sus semestres, materias y notas. */
  removeWithChildren: (id: string) => boolean
}

/**
 * Unico punto donde se crean o modifican usuarios: garantiza que la contrasena
 * siempre pase por el hash y que el correo no se duplique.
 */
export const useUserStore = defineStore('users', (): UserStore => {
  const collection = useEntityCollection(userRepository)
  const semesterStore = useSemesterStore()

  const publicUsers = computed<PublicUser[]>(() => collection.items.value.map(toPublicUser))

  async function createUser(input: UserInput): Promise<UserMutationResult> {
    if (input.password === undefined || input.password.trim() === '') {
      return { ok: false, error: 'La contrasena es obligatoria.' }
    }

    if (userRepository.emailExists(input.email)) {
      return { ok: false, error: 'Ya existe un usuario con ese correo.' }
    }

    const created = collection.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      passwordHash: await authService.hash(input.password),
    })

    return { ok: true, user: toPublicUser(created) }
  }

  async function updateUser(id: string, input: UserInput): Promise<UserMutationResult> {
    if (userRepository.emailExists(input.email, id)) {
      return { ok: false, error: 'Ya existe otro usuario con ese correo.' }
    }

    const hasNewPassword = input.password !== undefined && input.password.trim() !== ''
    const updated = collection.update(id, {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      ...(hasNewPassword ? { passwordHash: await authService.hash(input.password as string) } : {}),
    })

    if (updated === null) {
      return { ok: false, error: 'El usuario ya no existe.' }
    }

    return { ok: true, user: toPublicUser(updated) }
  }

  function removeWithChildren(id: string): boolean {
    semesterStore.removeByUser(id)
    return collection.remove(id)
  }

  return {
    items: collection.items,
    publicUsers,
    refresh: collection.refresh,
    findById: collection.findById,
    createUser,
    updateUser,
    removeWithChildren,
  }
})
