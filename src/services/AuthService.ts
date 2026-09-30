import type { LoginDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';
import { useAuthStore } from '@/stores/AuthStore.js';

export class AuthService {
  public static login(dto: LoginDTO): UserInterface | undefined {
    const user = UserService.getUsers().find(
      (existingUser: UserInterface): boolean =>
        existingUser.email === dto.email && existingUser.password === dto.password,
    );

    if (user !== undefined) {
      useAuthStore().loggedUserId = user.id;
    }

    return user;
  }

  public static logout(): void {
    useAuthStore().loggedUserId = null;
  }

  public static getLoggedUser(): UserInterface | undefined {
    const loggedUserId = useAuthStore().loggedUserId;

    return loggedUserId === null ? undefined : UserService.getUserById(loggedUserId);
  }
}
