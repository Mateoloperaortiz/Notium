import { RolesGuard } from './roles.guard.js';
import { Role } from '../../users/enums/role.enum.js';
import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import { describe, expect, it } from 'vitest';

describe('RolesGuard', (): void => {
  const createContext = (role: Role): ExecutionContext =>
    ({
      getClass: (): object => ({}),
      getHandler: (): object => ({}),
      switchToHttp: (): object => ({ getRequest: (): object => ({ user: { role } }) }),
    }) as unknown as ExecutionContext;

  const createGuard = (roles: Role[] | undefined): RolesGuard =>
    new RolesGuard({ getAllAndOverride: (): Role[] | undefined => roles } as unknown as Reflector);

  it('lets any logged-in user through a route without roles', (): void => {
    expect(createGuard(undefined).canActivate(createContext(Role.User))).toBe(true);
  });

  it('lets an administrator through an admin route', (): void => {
    expect(createGuard([Role.Admin]).canActivate(createContext(Role.Admin))).toBe(true);
  });

  it('blocks a student from an admin route', (): void => {
    expect(createGuard([Role.Admin]).canActivate(createContext(Role.User))).toBe(false);
  });
});
