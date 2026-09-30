import { AuthService } from '@/services/AuthService.js';
import type { NavigationGuardReturn, RouteLocationNormalized, Router } from 'vue-router';

/** Global guard: asks for login, skips the login page when logged in and checks admin roles. */
export const configureRouterGuards = (router: Router): void => {
  router.beforeEach((to: RouteLocationNormalized): NavigationGuardReturn => {
    AuthService.clearExpiredSession();

    const loggedUser = AuthService.getLoggedUser();

    if (to.meta.requiresAuth && loggedUser === undefined) {
      return { name: 'login', query: { redirect: to.fullPath } };
    }

    if (to.name === 'login' && loggedUser !== undefined) {
      return { name: 'dashboard' };
    }

    const allowedRoles = to.meta.roles;

    if (allowedRoles && (loggedUser === undefined || !allowedRoles.includes(loggedUser.role))) {
      return { name: 'dashboard' };
    }

    return true;
  });
};
