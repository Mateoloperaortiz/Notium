import { Role, type UserInterface } from '@/interfaces/UserInterface.js';

/** Demo accounts loaded on the first run; the passwords are for local testing only. */
export const userSeeder: UserInterface[] = [
  {
    id: 1,
    name: 'Mateo',
    email: 'mateo@example.com',
    password: 'mateo-password',
    role: Role.User,
    createdAt: 1767254400000,
    updatedAt: 1767254400000,
  },
  {
    id: 2,
    name: 'Lucía',
    email: 'lucia@example.com',
    password: 'lucia-password',
    role: Role.User,
    createdAt: 1767340800000,
    updatedAt: 1767340800000,
  },
  {
    id: 3,
    name: 'Administrador',
    email: 'admin@example.com',
    password: 'admin-password',
    role: Role.Admin,
    createdAt: 1767427200000,
    updatedAt: 1767427200000,
  },
];
