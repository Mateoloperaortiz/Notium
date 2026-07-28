import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

import { registerGuards } from './guards'
import { routes } from './routes'

export const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes],
  scrollBehavior: () => ({ top: 0 }),
})

registerGuards(router)

export { RouteName } from './routes'
