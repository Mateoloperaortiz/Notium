import type { SessionUserDTO } from '@/dtos/UserDTOs.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/** Session state: the API token and the logged-in user; only the services read or write it. */
export const useAuthStore = defineStore(
  'auth',
  (): { loggedUser: Ref<SessionUserDTO | null>; token: Ref<string | null> } => {
    const loggedUser = ref<SessionUserDTO | null>(null);
    const token = ref<string | null>(null);

    return { loggedUser, token };
  },
);
