// internal imports
import { configureRouterGuards } from './accessControl.js';
import DashboardView from '@/views/DashboardView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SemesterIndexView from '@/views/SemesterIndexView.vue';
import SemesterShowView from '@/views/SemesterShowView.vue';
import SubjectShowPlaceholderView from '@/views/SubjectShowPlaceholderView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/semesters',
      name: 'semester-index',
      component: SemesterIndexView,
      meta: { requiresAuth: true },
    },
    {
      path: '/semesters/:id',
      name: 'semester-show',
      component: SemesterShowView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/semesters/:semesterId/subjects/:subjectId',
      name: 'subject-show',
      component: SubjectShowPlaceholderView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
  scrollBehavior: (): ScrollToOptions => ({ top: 0 }),
});

configureRouterGuards(router);

export default router;
