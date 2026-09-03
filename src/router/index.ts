import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/semesters',
    name: 'semester-index',
    component: () => import('@/views/SemesterIndexView.vue'),
  },
  {
    path: '/semesters/:id',
    name: 'semester-show',
    component: () => import('@/views/SemesterShowView.vue'),
    props: true,
  },
  {
    path: '/semesters/:semesterId/subjects/:subjectId',
    name: 'subject-show',
    component: () => import('@/views/SubjectShowPlaceholderView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (): { top: number } => ({ top: 0 }),
});

export default router;
