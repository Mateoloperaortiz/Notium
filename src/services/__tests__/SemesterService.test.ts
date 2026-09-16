import type { CreateSemesterDTO } from '@/dtos/SemesterDTOs.js';
import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import { Role, type UserInterface } from '@/interfaces/UserInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useSemesterStore } from '@/stores/SemesterStore.js';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

const currentUser: UserInterface = {
  createdAt: 0,
  email: 'student@example.com',
  id: 'user-1',
  name: 'Student',
  password: 'password',
  role: Role.User,
  semesters: [],
  updatedAt: 0,
};

const otherUser: UserInterface = {
  ...currentUser,
  email: 'other@example.com',
  id: 'user-2',
  name: 'Other student',
};

const semesterDTO: CreateSemesterDTO = {
  name: '  2026-1  ',
  period: 1,
  status: StatusSemester.inProgress,
  year: 2026,
};

const buildSemester = (id: string, user: UserInterface): SemesterInterface => ({
  ...semesterDTO,
  createdAt: 0,
  id,
  subjects: [],
  updatedAt: 0,
  user,
});

describe('SemesterService', (): void => {
  beforeEach((): void => {
    setActivePinia(createPinia());
    useAuthStore().login(currentUser);
  });

  it('returns only the semesters belonging to the current user', async (): Promise<void> => {
    const semesterStore = useSemesterStore();
    semesterStore.semester.push(buildSemester('semester-1', currentUser));
    semesterStore.semester.push(buildSemester('semester-2', otherUser));

    const semesters = await SemesterService.findAllByCurrentUser();

    expect(semesters.map((semester: SemesterInterface): string => semester.id)).toEqual([
      'semester-1',
    ]);
  });

  it('creates a semester with normalized data and the current user', async (): Promise<void> => {
    const semester = await SemesterService.create(semesterDTO);

    expect(semester).toMatchObject({
      name: '2026-1',
      period: 1,
      status: StatusSemester.inProgress,
      user: currentUser,
      year: 2026,
    });
    expect(semester.id).toEqual(expect.any(String));
    expect(
      useSemesterStore().semester.some(
        (storedSemester: SemesterInterface): boolean => storedSemester.id === semester.id,
      ),
    ).toBe(true);
  });

  it('updates and deletes a semester owned by the current user', async (): Promise<void> => {
    const semester = await SemesterService.create(semesterDTO);
    const originalUpdatedAt = semester.updatedAt;

    const updatedSemester = await SemesterService.update(semester.id, {
      name: '2026-2',
      period: 2,
    });

    expect(updatedSemester).toMatchObject({ name: '2026-2', period: 2 });
    expect(updatedSemester?.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    expect(await SemesterService.delete(semester.id)).toBe(true);
    expect(await SemesterService.findById(semester.id)).toBeUndefined();
  });

  it('reports validation errors for invalid semester data', (): void => {
    const errors = SemesterService.validateFields({
      name: '   ',
      period: 3,
      status: '' as StatusSemester,
      year: 1999,
    });

    expect(errors).toEqual({
      name: 'Escribe un nombre para identificar el semestre.',
      period: 'El periodo debe ser 1 o 2.',
      status: 'Selecciona un estado para el semestre.',
      year: 'Ingresa un año válido.',
    });
  });

  it('rejects creation when there is no authenticated user', async (): Promise<void> => {
    useAuthStore().logout();

    await expect(SemesterService.create(semesterDTO)).rejects.toThrow(
      'No existe un usuario para asociar el semestre.',
    );
  });
});
