import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

export const useAuthStore = defineStore('auth', (): { loggedUserId: Ref<number | null> } => {
  const loggedUserId = ref<number | null>(null);

  return { loggedUserId };
});
