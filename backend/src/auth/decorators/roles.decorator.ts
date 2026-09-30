import type { Role } from '../../users/enums/role.enum.js';
import { type CustomDecorator, SetMetadata } from '@nestjs/common';

/** Metadata key that RolesGuard reads. */
export const ROLES_KEY = 'roles';

/** Restricts a route to the given roles. */
export const Roles = (...roles: Role[]): CustomDecorator<string> => SetMetadata(ROLES_KEY, roles);
