import { Role } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';
import { describe, expect, it } from 'vitest';

describe('UserService.validateFields', (): void => {
  it('accepts valid user data', (): void => {
    const errors = UserService.validateFields({
      email: 'nuevo@example.com',
      name: 'Nuevo',
      password: 'una-clave',
      role: Role.User,
    });

    expect(errors).toEqual({ email: '', name: '', password: '' });
  });

  it('reports one message per invalid field', (): void => {
    const errors = UserService.validateFields({
      email: 'no-es-correo',
      name: ' ',
      password: '123',
      role: Role.User,
    });

    expect(errors).toEqual({
      email: 'Ingresa un correo válido.',
      name: 'El nombre es obligatorio.',
      password: 'La contraseña debe tener al menos 6 caracteres.',
    });
  });
});
