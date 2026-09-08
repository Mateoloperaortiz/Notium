import type { SemesterInterface } from './SemesterInterface.js';

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export interface UserInterface {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: number;
  updatedAt: number;
  semesters: SemesterInterface[];
}
