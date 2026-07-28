import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import { UserRole } from '@/models'
import type { PublicUser } from '@/models'
import { authService } from '@/services/auth.service'
import type { Credentials } from '@/services/auth.service'

interface AuthStore {
  currentUser: Ref<PublicUser | null>
  isAuthenticated: ComputedRef<boolean>
  isAdmin: ComputedRef<boolean>
  displayName: ComputedRef<string>
  login: (credentials: Credentials) => Promise<string | null>
  logout: () => void
  restoreSession: () => void
}

export const useAuthStore = defineStore('auth', (): AuthStore => {
  const currentUser = ref<PublicUser | null>(null)

  const isAuthenticated = computed<boolean>(() => currentUser.value !== null)
  const isAdmin = computed<boolean>(() => currentUser.value?.role === UserRole.Admin)
  const displayName = computed<string>(() => currentUser.value?.name ?? 'Invitado')

  /** Devuelve `null` cuando el ingreso fue exitoso, o el mensaje de error. */
  async function login(credentials: Credentials): Promise<string | null> {
    const result = await authService.login(credentials)
    if (!result.ok) {
      return result.error
    }

    currentUser.value = result.user
    return null
  }

  function logout(): void {
    authService.logout()
    currentUser.value = null
  }

  function restoreSession(): void {
    currentUser.value = authService.restoreSession()
  }

  return { currentUser, isAuthenticated, isAdmin, displayName, login, logout, restoreSession }
})
