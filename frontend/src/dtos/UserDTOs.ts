import type { Role, UserInterface } from '@/interfaces/UserInterface.js';

/** Fields an administrator fills to create a user; the password travels only on the way in. */
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: Role;
}

/** Changes to a user; missing fields keep their current value and an empty password is ignored. */
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
