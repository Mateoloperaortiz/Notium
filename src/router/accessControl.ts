import { useAuthStore } from '@/stores/AuthStore.js';
import type { NavigationGuardReturn, RouteLocationNormalized, Router } from 'vue-router';

export const configureRouterGuards = (router: Router): void => {
  router.beforeEach((to: RouteLocationNormalized): NavigationGuardReturn => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (to.name === 'login' && authStore.isAuthenticated()) {
      return { name: 'dashboard' };
    }

    const allowedRoles = to.meta.roles;
    const currentRole = authStore.currentUser?.role;

    if (allowedRoles && (currentRole === undefined || !allowedRoles.includes(currentRole))) {
      return { name: 'dashboard' };
    }

    return true;
  });
};
