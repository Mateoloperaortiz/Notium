import type User from '@/models/User.js';
import { userService } from '@/services/UserService.js';
import { defineStore } from 'pinia';
import { ref, type Ref, shallowRef, type ShallowRef } from 'vue';

interface UserStoreSetup {
  activeUser: ShallowRef<User | undefined>;
  errorMessage: Ref<string>;
  initialize(): Promise<void>;
  isLoading: Ref<boolean>;
}

export const useUserStore = defineStore('user', (): UserStoreSetup => {
  const activeUser = shallowRef<User>();
  const errorMessage = ref<string>('');
  const isLoading = ref<boolean>(false);

  async function initialize(): Promise<void> {
    if (activeUser.value || isLoading.value) {
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';

    try {
      activeUser.value = await userService.findCurrent();
    } catch (error: unknown) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No fue posible cargar el usuario activo.';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    activeUser,
    errorMessage,
    initialize,
    isLoading,
  };
});
