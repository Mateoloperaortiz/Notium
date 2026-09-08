import type { UserInterface } from '@/interfaces/UserInterface';
import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';

interface AuthStoreSetup {
  currentUser: Ref<UserInterface | null>;
  isAuthenticated: () => boolean;
  login: (user: UserInterface) => void;
  logout: () => void;
}

export const useAuthStore = defineStore('auth', (): AuthStoreSetup => {
  const currentUser = ref<UserInterface | null>(null);

  const login = (user: UserInterface): void => {
    currentUser.value = user;
  };

  const logout = (): void => {
    currentUser.value = null;
  };

  const isAuthenticated = (): boolean => {
    return currentUser.value !== null;
  };

  return {
    currentUser,
    login,
    logout,
    isAuthenticated,
  };
});
