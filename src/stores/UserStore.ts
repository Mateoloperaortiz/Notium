import type { UserInterface } from '@/interfaces/UserInterface.js';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

/** Holds every user; only UserService reads or writes it. */
export const useUserStore = defineStore('user', (): { users: Ref<UserInterface[]> } => {
  const users = ref<UserInterface[]>([]);

  return { users };
});
