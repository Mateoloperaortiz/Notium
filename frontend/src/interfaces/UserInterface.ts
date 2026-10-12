/** Access level that the router guards check. */
export enum Role {
  Admin = 'admin',
  User = 'user',
}

/** A platform account, either a student or an administrator. */
export interface UserInterface {
  id: number;
  name: string;
  /** Unique across users and stored in lowercase. */
  email: string;
  role: Role;
  /** Creation time as an ISO date string. */
  createdAt: string;
  /** Last update time as an ISO date string. */
  updatedAt: string;
}
