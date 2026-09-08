import type { CreateUserDTO, UpdateUserDTO, UserValidationErrorsDTO } from '@/dtos/UserDTOs.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useUserStore } from '@/stores/UserStore.js';

const generateUserId = (): string => globalThis.crypto.randomUUID();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserService {
  public static async findAll(): Promise<UserInterface[]> {
    return [...useUserStore().users];
  }

  public static async findById(id: string): Promise<UserInterface | undefined> {
    return useUserStore().users.find((user: UserInterface): boolean => user.id === id);
  }

  public static async findCurrent(): Promise<UserInterface | undefined> {
    return useAuthStore().currentUser ?? undefined;
  }

  public static async create(dto: CreateUserDTO): Promise<UserInterface> {
    const validatedDto: CreateUserDTO = UserService.validate(dto);
    const timestamp = Date.now();
    const user: UserInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: generateUserId(),
      semesters: [],
      updatedAt: timestamp,
    };

    useUserStore().users.push(user);

    return user;
  }

  public static async update(id: string, dto: UpdateUserDTO): Promise<UserInterface | undefined> {
    const user = await UserService.findById(id);

    if (user === undefined) {
      return undefined;
    }

    const mergedDto: CreateUserDTO = {
      email: dto.email ?? user.email,
      name: dto.name ?? user.name,
      password: dto.password ?? user.password,
      role: dto.role ?? user.role,
    };
    const validatedDto: CreateUserDTO = UserService.validate(mergedDto, id);

    Object.assign(user, validatedDto, { updatedAt: Date.now() });

    return user;
  }

  public static async delete(id: string): Promise<boolean> {
    const users = useUserStore().users;
    const userIndex = users.findIndex((user: UserInterface): boolean => user.id === id);

    if (userIndex === -1) {
      return false;
    }

    if (useAuthStore().currentUser?.id === id) {
      useAuthStore().logout();
    }

    users.splice(userIndex, 1);

    return true;
  }

  public static validateFields(dto: CreateUserDTO, excludedId?: string): UserValidationErrorsDTO {
    const email = dto.email.trim().toLowerCase();
    const emailTaken = useUserStore().users.some(
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

  private static getEmailError(email: string, emailTaken: boolean): string {
    if (!email) return 'El correo es obligatorio.';
    if (!EMAIL_PATTERN.test(email)) return 'Ingresa un correo válido.';
    if (emailTaken) return 'Ya existe un usuario con este correo.';
    return '';
  }

  private static validate(dto: CreateUserDTO, excludedId?: string): CreateUserDTO {
    const errors: UserValidationErrorsDTO = UserService.validateFields(dto, excludedId);
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
