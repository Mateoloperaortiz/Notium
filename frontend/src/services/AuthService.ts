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

  /** Ends the session when its token already expired; the router guard calls it on each navigation. */
  public static clearExpiredSession(): void {
    const token = useAuthStore().token;

    if (token && AuthService.isTokenExpired(token)) {
      AuthService.logout();
    }
  }

  /** Reads the exp claim of the JWT; a token that cannot be read counts as expired. */
  private static isTokenExpired(token: string): boolean {
    try {
      const encodedPayload = (token.split('.')[1] ?? '').replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(encodedPayload)) as { exp?: number };

      return payload.exp !== undefined && payload.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }
}
