import type { Role } from '../../users/enums/role.enum.js';

/** User data the frontend keeps during the session; never includes the password. */
export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}
