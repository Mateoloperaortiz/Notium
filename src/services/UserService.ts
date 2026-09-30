import type { CreateUserDTO, UpdateUserDTO, UserValidationErrorsDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
import { useUserStore } from '@/stores/UserStore.js';
import { IdUtil } from '@/utils/IdUtil.js';

/** Reads and writes users in UserStore and validates their data. */
export class UserService {
  /** Returns every user of the platform. */
  public static getUsers(): UserInterface[] {
    return useUserStore().users;
  }

  /** Returns the user with the given ID, or undefined if it does not exist. */
  public static getUserById(id: number): UserInterface | undefined {
    return UserService.getUsers().find((user: UserInterface): boolean => user.id === id);
  }

  /** Validates the data and saves a new user; throws if the data is invalid. */
  public static createUser(dto: CreateUserDTO): UserInterface {
    const validatedDto = UserService.validate(dto);
    const timestamp = Date.now();
    const user: UserInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: IdUtil.getNextId(UserService.getUsers()),
      updatedAt: timestamp,
    };

    useUserStore().users.push(user);

    return user;
  }

  /** Validates and applies the changes; undefined if the user does not exist. */
  public static updateUser(id: number, dto: UpdateUserDTO): UserInterface | undefined {
    const user = UserService.getUserById(id);

    if (user === undefined) {
      return undefined;
    }

    const validatedDto = UserService.validate(
      {
        email: dto.email ?? user.email,
        name: dto.name ?? user.name,
        password: dto.password ?? user.password,
        role: dto.role ?? user.role,
      },
      id,
    );

    Object.assign(user, validatedDto, { updatedAt: Date.now() });

    return user;
  }

  /** Deletes the user and, in cascade, their semesters, subjects and grades. */
  public static deleteUser(id: number): boolean {
    const users = UserService.getUsers();
    const userIndex = users.findIndex((user: UserInterface): boolean => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    SemesterService.deleteSemestersByUserId(id);

    return true;
  }

  /** One message per invalid field; excludedId lets a user keep their own email. */
  public static validateFields(dto: CreateUserDTO, excludedId?: number): UserValidationErrorsDTO {
    const email = dto.email.trim().toLowerCase();
    const emailTaken = UserService.getUsers().some(
      (user: UserInterface): boolean =>
        user.id !== excludedId && user.email.toLowerCase() === email,
    );

    return {
      email: UserService.getEmailError(email, emailTaken),
      name: dto.name.trim() ? '' : 'El nombre es obligatorio.',
      password:
        dto.password.trim().length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.',
    };
  }

  /** Message for an empty, malformed or taken email; an empty string if it is valid. */
  private static getEmailError(email: string, emailTaken: boolean): string {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      return 'El correo es obligatorio.';
    }

    if (!emailPattern.test(email)) {
      return 'Ingresa un correo válido.';
    }

    if (emailTaken) {
      return 'Ya existe un usuario con este correo.';
    }

    return '';
  }

  /** Throws the first validation message, or returns the normalized data. */
  private static validate(dto: CreateUserDTO, excludedId?: number): CreateUserDTO {
    const errors = UserService.validateFields(dto, excludedId);
    const firstError = errors.name || errors.email || errors.password;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      email: dto.email.trim().toLowerCase(),
      name: dto.name.trim(),
      password: dto.password,
      role: dto.role,
    };
  }
}
