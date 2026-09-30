import { useAuthStore } from '@/stores/AuthStore.js';
import axios, { type AxiosError, type AxiosInstance } from 'axios';

/** HTTP client shared by the services that talk to the API. */
export class BaseService {
  /** Axios client for VITE_API_BASE_URL/api that sends the session token; a 401 ends the session. */
  protected static getClient(): AxiosInstance {
    const authStore = useAuthStore();
    const client = axios.create({
      baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
    });

    client.interceptors.response.use(
      undefined,
      (error: AxiosError<{ message?: string | string[] }>): Promise<never> => {
        if (error.response?.status === 401) {
          authStore.token = null;
          authStore.loggedUser = null;
        }

        return Promise.reject(BaseService.toError(error));
      },
    );

    return client;
  }

  /** Error carrying the message the API sent, or a connection message when there was no answer. */
  private static toError(error: AxiosError<{ message?: string | string[] }>): Error {
    if (error.response === undefined) {
      return new Error('No pudimos conectar con el servidor. Intenta de nuevo.');
    }

    const message = error.response.data?.message;

    return new Error(Array.isArray(message) ? message.join(' ') : (message ?? error.message));
  }
}
