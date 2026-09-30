import type { Role } from '../../users/enums/role.enum.js';

/** Data signed inside the JWT; sub is the user ID. */
export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}
