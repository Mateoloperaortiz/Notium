import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';

export const semesterSeeder: SemesterInterface[] = [
  {
    id: 1,
    userId: 1,
    name: '2026-1',
    year: 2026,
    period: 1,
    status: StatusSemester.inProgress,
    createdAt: 1768809600000,
    updatedAt: 1768809600000,
  },
  {
    id: 2,
    userId: 1,
    name: '2026-2',
    year: 2026,
    period: 2,
    status: StatusSemester.inComing,
    createdAt: 1785139200000,
    updatedAt: 1785139200000,
  },
  {
    id: 3,
    userId: 2,
    name: '2026-1',
    year: 2026,
    period: 1,
    status: StatusSemester.inProgress,
    createdAt: 1768813200000,
    updatedAt: 1768813200000,
  },
  {
    id: 4,
    userId: 2,
    name: '2026-2',
    year: 2026,
    period: 2,
    status: StatusSemester.inComing,
    createdAt: 1785142800000,
    updatedAt: 1785142800000,
  },
];
