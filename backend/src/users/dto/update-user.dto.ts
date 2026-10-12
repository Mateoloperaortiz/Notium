import { Role } from '../enums/role.enum.js';

/** Changes to a user; missing fields keep their current value. */
export class UpdateUserDto {
  public name?: string;

  public email?: string;

  public password?: string;

  public role?: Role;
}
