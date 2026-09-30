import { AuthService } from './auth.service.js';
import type { LoginDto } from './dto/login.dto.js';
import type { User } from '../users/entities/user.entity.js';
import { Role } from '../users/enums/role.enum.js';
import type { UsersService } from '../users/users.service.js';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import { beforeAll, describe, expect, it, vi } from 'vitest';

describe('AuthService', (): void => {
  let user: User;

  beforeAll(async (): Promise<void> => {
    user = {
      email: 'mateo@example.com',
      id: 1,
      name: 'Mateo',
      password: await hash('mateo-password', 4),
      role: Role.User,
    } as User;
  });

  const createService = (foundUser: User | null): AuthService => {
    const usersService = {
      findOne: vi.fn().mockResolvedValue(foundUser),
      findOneWithPasswordByEmail: vi.fn().mockResolvedValue(foundUser),
    } as unknown as UsersService;
    const jwtService = {
      signAsync: vi.fn().mockResolvedValue('signed-token'),
    } as unknown as JwtService;

    return new AuthService(usersService, jwtService);
  };

  it('returns a token and the session user without the password', async (): Promise<void> => {
    const response = await createService(user).login({
      email: 'mateo@example.com',
      password: 'mateo-password',
    });

    expect(response).toEqual({
      accessToken: 'signed-token',
      user: { email: 'mateo@example.com', id: 1, name: 'Mateo', role: Role.User },
    });
  });

  it('rejects a wrong password', async (): Promise<void> => {
    await expect(
      createService(user).login({ email: 'mateo@example.com', password: 'otra' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown email with the same error', async (): Promise<void> => {
    await expect(
      createService(null).login({ email: 'nadie@example.com', password: 'x' }),
    ).rejects.toThrow('Correo o contraseña incorrectos.');
  });

  it('answers 400 when the body does not have an email and a password', async (): Promise<void> => {
    await expect(createService(user).login(undefined)).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      createService(user).login({ email: 123, password: 'x' } as unknown as LoginDto),
    ).rejects.toThrow('Escribe tu correo y tu contraseña.');
  });

  it('rejects the profile of a deleted account', async (): Promise<void> => {
    await expect(createService(null).getProfile(1)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
