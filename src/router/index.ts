// Imports internos
import { configureRouterGuards } from './accessControl.js';
import { Role } from '@/interfaces/UserInterface.js';
// Imports externos
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: (): Promise<typeof import('@/views/HomeView.vue')> =>
        import('@/views/HomeView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: (): Promise<typeof import('@/views/DashboardView.vue')> =>
        import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: (): Promise<typeof import('@/views/LoginView.vue')> =>
        import('@/views/LoginView.vue'),
    },
    {
      path: '/semesters',
      name: 'semester-index',
      component: (): Promise<typeof import('@/views/semester/SemesterIndexView.vue')> =>
        import('@/views/semester/SemesterIndexView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/semesters/:id',
      name: 'semester-show',
      component: (): Promise<typeof import('@/views/semester/SemesterShowView.vue')> =>
        import('@/views/semester/SemesterShowView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/subjects',
      name: 'subject-index',
      component: (): Promise<typeof import('@/views/subject/SubjectIndexView.vue')> =>
        import('@/views/subject/SubjectIndexView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/semesters/:semesterId/subjects/:subjectId',
      name: 'subject-show',
      component: (): Promise<typeof import('@/views/subject/SubjectShowView.vue')> =>
        import('@/views/subject/SubjectShowView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/grades',
      name: 'grade-index',
      component: (): Promise<typeof import('@/views/grade/GradeIndexView.vue')> =>
        import('@/views/grade/GradeIndexView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/subjects/:subjectId/grades/:gradeId',
      name: 'grade-show',
      component: (): Promise<typeof import('@/views/grade/GradeShowView.vue')> =>
        import('@/views/grade/GradeShowView.vue'),
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: (): Promise<typeof import('@/views/AnalyticsView.vue')> =>
        import('@/views/AnalyticsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: (): Promise<typeof import('@/views/admin/AdminUsersView.vue')> =>
        import('@/views/admin/AdminUsersView.vue'),
      meta: { requiresAuth: true, roles: [Role.Admin] },
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: (): Promise<typeof import('@/views/admin/AdminReportsView.vue')> =>
        import('@/views/admin/AdminReportsView.vue'),
      meta: { requiresAuth: true, roles: [Role.Admin] },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: (): Promise<typeof import('@/views/NotFoundView.vue')> =>
        import('@/views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: (): ScrollToOptions => ({ top: 0 }),
});

configureRouterGuards(router);

export default router;
