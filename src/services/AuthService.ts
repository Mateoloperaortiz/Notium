import type { LoginDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';
import { useAuthStore } from '@/stores/AuthStore.js';

/** Logs users in and out and exposes the logged-in user. */
export class AuthService {
  /** Starts a session if the credentials match and returns the user; undefined otherwise. */
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

  /** Clears the session. */
  public static logout(): void {
    useAuthStore().loggedUserId = null;
  }

  /** Returns the logged-in user, or undefined when there is no session. */
  public static getLoggedUser(): UserInterface | undefined {
    const loggedUserId = useAuthStore().loggedUserId;

    return loggedUserId === null ? undefined : UserService.getUserById(loggedUserId);
  }
}
