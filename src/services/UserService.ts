import type { UserInterface } from '@/interfaces/UserInterface.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useUserStore } from '@/stores/UserStore.js';

export class UserService {
  public static async findAll(): Promise<UserInterface[]> {
    return [...useUserStore().users];
  }

  public static async findById(id: string): Promise<UserInterface | undefined> {
    return useUserStore().users.find((user: UserInterface): boolean => user.id === id);
  }

  public static async findCurrent(): Promise<UserInterface | undefined> {
    return useAuthStore().currentUser ?? undefined;
  }
}
