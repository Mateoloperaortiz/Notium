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
  /** Plain text, acceptable only for demo data while there is no backend. */
  password: string;
  role: Role;
  /** Creation time as a Unix timestamp in milliseconds. */
  createdAt: number;
  /** Last update time as a Unix timestamp in milliseconds. */
  updatedAt: number;
}
