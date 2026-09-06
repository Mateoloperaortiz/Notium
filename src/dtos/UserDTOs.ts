import type { UserInterface } from '@/interfaces/UserInterface.js';

type UserManagedFields = 'createdAt' | 'id' | 'semesters' | 'updatedAt';

export type CreateUserDTO = Omit<UserInterface, UserManagedFields>;

export type UpdateUserDTO = Partial<CreateUserDTO>;
