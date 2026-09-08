// internal imports
import { configureRouterGuards } from './accessControl.js';
import DashboardView from '@/views/DashboardView.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import SemesterIndexView from '@/views/semester/SemesterIndexView.vue';
import SemesterShowView from '@/views/semester/SemesterShowView.vue';
import SubjectIndexView from '@/views/subject/SubjectIndexView.vue';
import SubjectShowView from '@/views/subject/SubjectShowView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
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
      path: '/subjects',
      name: 'subject-index',
      component: SubjectIndexView,
      meta: { requiresAuth: true },
    },
    {
      path: '/semesters/:semesterId/subjects/:subjectId',
      name: 'subject-show',
      component: SubjectShowView,
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
