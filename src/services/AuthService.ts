import type { UserInterface } from '@/interfaces/UserInterface.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useUserStore } from '@/stores/UserStore.js';

interface Credentials {
  email: string;
  password: string;
}

export class AuthService {
  public static login(credentials: Credentials): UserInterface | null {
    const userStore = useUserStore();

    const user = userStore.users.find(
      (existingUser: UserInterface): boolean =>
        existingUser.email === credentials.email && existingUser.password === credentials.password,
    );

    if (!user) {
      return null;
    }

    useAuthStore().login(user);

    return user;
  }

  public static logout(): void {
    useAuthStore().logout();
  }
}
