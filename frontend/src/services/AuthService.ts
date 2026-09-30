import type { LoginDTO, LoginResponseDTO, SessionUserDTO } from '@/dtos/UserDTOs.js';
import { BaseService } from '@/services/BaseService.js';
import { useAuthStore } from '@/stores/AuthStore.js';

/** Logs users in against the API and keeps the session in AuthStore. */
export class AuthService extends BaseService {
  /** Sends the credentials to POST /auth/login and saves the token and the user; throws on 401. */
  public static async login(dto: LoginDTO): Promise<SessionUserDTO> {
    const { data } = await AuthService.getClient().post<LoginResponseDTO>('/auth/login', dto);
    const authStore = useAuthStore();

    authStore.token = data.accessToken;
    authStore.loggedUser = data.user;

    return data.user;
  }

  /** Clears the token and the user of the session. */
  public static logout(): void {
    const authStore = useAuthStore();

    authStore.token = null;
    authStore.loggedUser = null;
  }

  /** Returns the logged-in user, or undefined when there is no session. */
  public static getLoggedUser(): SessionUserDTO | undefined {
    return useAuthStore().loggedUser ?? undefined;
  }
}
