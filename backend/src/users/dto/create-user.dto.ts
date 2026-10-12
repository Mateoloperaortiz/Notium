import { Role } from '../enums/role.enum.js';

/** Fields an administrator sends to create a user. */
export class CreateUserDto {
  public name: string;

  public email: string;

  public password: string;

  public role: Role;
}
