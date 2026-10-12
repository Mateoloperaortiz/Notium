import { UsersService } from './users.service.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { Role } from './enums/role.enum.js';
import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('UsersService', (): void => {
  let repository: Repository<User>;
  let service: UsersService;

  const existingUser = (): User =>
    ({ email: 'mateo@example.com', id: 1, name: 'Mateo', role: Role.User }) as User;

  const validDto = (): CreateUserDto => ({
    email: 'Nuevo@Example.com',
    name: 'Nuevo',
    password: 'una-clave-segura',
    role: Role.User,
  });

  beforeEach((): void => {
    repository = {
      create: vi.fn((data: Partial<User>): Partial<User> => data),
      find: vi.fn(),
      findOneBy: vi.fn(),
      remove: vi.fn().mockResolvedValue(undefined),
      save: vi.fn((entity: User): Promise<User> => Promise.resolve({ ...entity, id: 99 })),
    } as unknown as Repository<User>;
    service = new UsersService(repository);
  });

  it('lists every user', async (): Promise<void> => {
    const users = [existingUser()];
    vi.mocked(repository.find).mockResolvedValue(users);

    await expect(service.findAll()).resolves.toBe(users);
  });

  it('answers 404 when the user does not exist', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(null);

    await expect(service.findOneOrFail(1)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('creates a user, lowercasing the email and hashing the password', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValueOnce(null).mockResolvedValue(existingUser());

    await service.create(validDto());

    const saved = vi.mocked(repository.create).mock.calls[0][0] as Partial<User>;
    expect(saved.email).toBe('nuevo@example.com');
    expect(saved.password).not.toBe('una-clave-segura');
    expect(saved.password).toMatch(/^\$2[aby]\$/);
  });

  it('answers 409 when the email already exists', async (): Promise<void> => {
    vi.mocked(repository.findOneBy).mockResolvedValue(existingUser());

    await expect(service.create(validDto())).rejects.toBeInstanceOf(ConflictException);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('rejects a short password with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), password: '123' })).rejects.toThrow(
      'La contraseña debe tener al menos 6 caracteres.',
    );
  });

  it('rejects an invalid email with 400', async (): Promise<void> => {
    await expect(service.create({ ...validDto(), email: 'no-es-correo' })).rejects.toThrow(
      'Ingresa un correo válido.',
    );
  });

  it('updates a user without touching the password when none is sent', async (): Promise<void> => {
    const user = { ...existingUser(), password: 'hash-anterior' } as User;
    vi.mocked(repository.findOneBy).mockResolvedValue(user);

    await service.update(1, { name: 'Mateo Nuevo' });

    expect(user.name).toBe('Mateo Nuevo');
    expect(user.password).toBe('hash-anterior');
  });

  it('rehashes the password when a new one is sent', async (): Promise<void> => {
    const user = { ...existingUser(), password: 'hash-anterior' } as User;
    vi.mocked(repository.findOneBy).mockResolvedValue(user);

    await service.update(1, { password: 'otra-clave-segura' });

    expect(user.password).not.toBe('hash-anterior');
    expect(user.password).toMatch(/^\$2[aby]\$/);
  });

  it('removes a user', async (): Promise<void> => {
    const user = existingUser();
    vi.mocked(repository.findOneBy).mockResolvedValue(user);

    await service.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(user);
  });
});
