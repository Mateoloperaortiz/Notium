import type { UserInterface } from '@/interfaces/UserInterface.js';

/** Fields the service assigns, so the form never sends them. */
type UserManagedFields = 'createdAt' | 'id' | 'updatedAt';

/** Fields filled in the user form; the service adds the managed ones. */
export type CreateUserDTO = Omit<UserInterface, UserManagedFields>;

/** Changes to a user; missing fields keep their current value. */
export type UpdateUserDTO = Partial<CreateUserDTO>;

/** Credentials typed in the login form. */
export interface LoginDTO {
  email: string;
  password: string;
}

/** One message per field; an empty string means the field is valid. */
export interface UserValidationErrorsDTO {
  email: string;
  name: string;
  password: string;
}

/** User data the API returns for the session; never includes the password. */
export type SessionUserDTO = Pick<UserInterface, 'email' | 'id' | 'name' | 'role'>;

/** Body the API returns after a successful login. */
export interface LoginResponseDTO {
  accessToken: string;
  user: SessionUserDTO;
}
