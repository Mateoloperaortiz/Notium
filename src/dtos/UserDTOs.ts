import type { UserInterface } from '@/interfaces/UserInterface.js';

type UserManagedFields = 'createdAt' | 'id' | 'updatedAt';

export type CreateUserDTO = Omit<UserInterface, UserManagedFields>;

export type UpdateUserDTO = Partial<CreateUserDTO>;

export interface LoginDTO {
  email: string;
  password: string;
}

export interface UserValidationErrorsDTO {
  email: string;
  name: string;
  password: string;
}
