import type { SessionUser } from './session-user.interface.js';

/** Body returned by POST /api/auth/login. */
export interface LoginResponse {
  accessToken: string;
  user: SessionUser;
}
