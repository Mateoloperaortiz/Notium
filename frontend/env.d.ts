/// <reference types="vite/client" />

import type { Role } from '@/interfaces/UserInterface.js';

declare global {
  interface ImportMetaEnv {
    /** Base URL of the API without /api, such as http://localhost:3000. */
    readonly VITE_API_BASE_URL: string;
  }
}

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: Role[];
  }
}
