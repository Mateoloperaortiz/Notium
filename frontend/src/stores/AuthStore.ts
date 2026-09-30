import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/** Session state: the logged-in user ID, or null; only AuthService reads or writes it. */
export const useAuthStore = defineStore('auth', (): { loggedUserId: Ref<number | null> } => {
  const loggedUserId = ref<number | null>(null);

  return { loggedUserId };
});
