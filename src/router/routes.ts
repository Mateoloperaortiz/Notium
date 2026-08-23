import type { RouteRecordRaw } from 'vue-router'

import type { UserRole } from '@/models'

/** Nombres de ruta centralizados: ninguna vista escribe rutas como texto suelto. */
export const RouteName = {
  Home: 'home',
  Login: 'login',
  NotFound: 'not-found',
  Dashboard: 'dashboard',
  Semesters: 'semester',
} as const

export type RouteName = (typeof RouteName)[keyof typeof RouteName]

declare module 'vue-router' {
  interface RouteMeta {
    /** Titulo mostrado en la pestana del navegador y en el encabezado. */
    title: string
    requiresAuth?: boolean
    /** Roles autorizados; si no se define, basta con estar autenticado. */
    roles?: readonly UserRole[]
    /** Enlace visible en la navegacion lateral. */
    inSidebar?: boolean
    icon?: string
  }
}

export const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: RouteName.Home,
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'Inicio' },
  },
  {
    path: '/login',
    name: RouteName.Login,
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Iniciar sesion' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: RouteName.NotFound,
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Pagina no encontrada' },
  },
  {
    path: '/dashboard',
    name: RouteName.Dashboard,
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Tu Dashboard', inSidebar: true, requiresAuth: true },
  },
  {
    path: '/semestres',
    name: RouteName.Semesters,
    component: () => import('@/views/SemesterCRUDView.vue'),
    meta: { title: 'Tus semestres', inSidebar: true, requiresAuth: true },
  },
]
