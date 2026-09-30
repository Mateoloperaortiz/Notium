/// <reference types="vite/client" />

import type { Role } from '@/interfaces/UserInterface.js';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: Role[];
  }
}
