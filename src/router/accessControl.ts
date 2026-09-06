import { useAuthStore } from '@/stores/AuthStore.js';
import type { NavigationGuardReturn, RouteLocationNormalized, Router } from 'vue-router';

export const configureRouterGuards = (router: Router): void => {
  router.beforeEach((to: RouteLocationNormalized): NavigationGuardReturn => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
      return { name: 'dashboard' };
    }

    return true;
  });
};
