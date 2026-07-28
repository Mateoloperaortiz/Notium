import type { NavigationGuardWithThis, Router } from 'vue-router'

import { env } from '@/config/env'
import { useAuthStore } from '@/stores/auth.store'
import { RouteName } from './routes'

/** Bloquea las rutas privadas y las rutas exclusivas de administradores. */
export const authGuard: NavigationGuardWithThis<undefined> = (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth === true && !auth.isAuthenticated) {
    return { name: RouteName.Login, query: { redirect: to.fullPath } }
  }

  const allowedRoles = to.meta.roles
  const role = auth.currentUser?.role
  if (allowedRoles !== undefined && (role === undefined || !allowedRoles.includes(role))) {
    return { name: RouteName.Home }
  }

  // Un usuario autenticado no necesita volver al formulario de ingreso.
  if (to.name === RouteName.Login && auth.isAuthenticated) {
    return { name: RouteName.Home }
  }

  return true
}

export function registerGuards(router: Router): void {
  router.beforeEach(authGuard)
  router.afterEach((to) => {
    document.title = `${to.meta.title} · ${env.appName}`
  })
}
