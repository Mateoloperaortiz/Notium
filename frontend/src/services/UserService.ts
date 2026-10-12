import type { CreateUserDTO, UpdateUserDTO, UserValidationErrorsDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { BaseService } from '@/services/BaseService.js';

/** Reads and writes platform users through the API; only administrators may call it. */
export class UserService extends BaseService {
  /** Returns every user of the platform. */
  public static async getUsers(): Promise<UserInterface[]> {
    const { data } = await UserService.getClient().get<UserInterface[]>('/users');

    return data;
  }

  /** Returns one user by ID. */
  public static async getUserById(id: number): Promise<UserInterface> {
    const { data } = await UserService.getClient().get<UserInterface>(`/users/${id}`);

    return data;
  }

  /** Creates a user; the API answers 409 when the email already exists. */
  public static async createUser(dto: CreateUserDTO): Promise<UserInterface> {
    const { data } = await UserService.getClient().post<UserInterface>('/users', dto);

    return data;
  }

  /** Applies changes to a user; an empty password leaves the current one untouched. */
  public static async updateUser(id: number, dto: UpdateUserDTO): Promise<UserInterface> {
    const { data } = await UserService.getClient().patch<UserInterface>(`/users/${id}`, dto);

    return data;
  }

  /** Deletes a user and, in cascade, their semesters, subjects and grades. */
  public static async deleteUser(id: number): Promise<void> {
    await UserService.getClient().delete(`/users/${id}`);
  }

  /** One message per invalid field; the API checks that the email is unique. */
  public static validateFields(dto: CreateUserDTO): UserValidationErrorsDTO {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = dto.email.trim().toLowerCase();

    return {
      email: UserService.getEmailError(email, emailPattern),
      name: dto.name.trim() ? '' : 'El nombre es obligatorio.',
      password:
        dto.password.trim().length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres.',
    };
  }

  /** Message for an empty or malformed email; an empty string if the format is valid. */
  private static getEmailError(email: string, emailPattern: RegExp): string {
    if (!email) {
      return 'El correo es obligatorio.';
    }

    if (!emailPattern.test(email)) {
      return 'Ingresa un correo válido.';
    }

    return '';
  }
}
