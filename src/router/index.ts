import {
  createRouter,
  createWebHistory,
  type RouteComponent,
  type RouteRecordRaw,
} from 'vue-router';

interface RouteComponentModule {
  default: RouteComponent;
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: (): Promise<RouteComponentModule> => import('@/views/DashboardView.vue'),
  },
  {
    path: '/semesters',
    name: 'semester-index',
    component: (): Promise<RouteComponentModule> => import('@/views/SemesterIndexView.vue'),
  },
  {
    path: '/semesters/:id',
    name: 'semester-show',
    component: (): Promise<RouteComponentModule> => import('@/views/SemesterShowView.vue'),
    props: true,
  },
  {
    path: '/semesters/:semesterId/subjects/:subjectId',
    name: 'subject-show',
    component: (): Promise<RouteComponentModule> =>
      import('@/views/SubjectShowPlaceholderView.vue'),
    props: true,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: (): Promise<RouteComponentModule> => import('@/views/NotFoundView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (): ScrollToOptions => ({ top: 0 }),
});

export default router;
