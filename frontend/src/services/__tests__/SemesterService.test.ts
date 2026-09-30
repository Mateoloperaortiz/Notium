import type { CreateSemesterDTO } from '@/dtos/SemesterDTOs.js';
import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { SemesterService } from '@/services/SemesterService.js';
import { SubjectService } from '@/services/SubjectService.js';
import { useSemesterStore } from '@/stores/SemesterStore.js';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

const semesterDTO: CreateSemesterDTO = {
  name: '  2026-1  ',
  period: 1,
  status: StatusSemester.inProgress,
  year: 2026,
};

describe('SemesterService', (): void => {
  beforeEach((): void => {
    setActivePinia(createPinia());
  });

  it('returns only the semesters of the given user', (): void => {
    SemesterService.createSemester(semesterDTO, 1);
    SemesterService.createSemester(semesterDTO, 2);

    const semesters = SemesterService.getSemestersByUserId(1);

    expect(semesters.map((semester: SemesterInterface): number => semester.userId)).toEqual([1]);
  });

  it('creates semesters with normalized data and sequential ids', (): void => {
    const firstSemester = SemesterService.createSemester(semesterDTO, 1);
    const secondSemester = SemesterService.createSemester(semesterDTO, 1);

    expect(firstSemester).toMatchObject({
      id: 1,
      name: '2026-1',
      period: 1,
      status: StatusSemester.inProgress,
      userId: 1,
      year: 2026,
    });
    expect(secondSemester.id).toBe(2);
    expect(useSemesterStore().semesters).toHaveLength(2);
  });

  it('updates and deletes a semester', (): void => {
    const semester = SemesterService.createSemester(semesterDTO, 1);
    const originalUpdatedAt = semester.updatedAt;

    const updatedSemester = SemesterService.updateSemester(semester.id, {
      name: '2026-2',
      period: 2,
    });

    expect(updatedSemester).toMatchObject({ name: '2026-2', period: 2 });
    expect(updatedSemester?.updatedAt).toBeGreaterThanOrEqual(originalUpdatedAt);
    expect(SemesterService.deleteSemester(semester.id)).toBe(true);
    expect(SemesterService.getSemesterById(semester.id)).toBeUndefined();
  });

  it('deletes the subjects and grades of a deleted semester', (): void => {
    const semester = SemesterService.createSemester(semesterDTO, 1);
    const subject = SubjectService.createSubject(
      { code: 'DW-01', credits: 3, name: 'Desarrollo Web', professor: 'Daniel Correa' },
      semester.id,
    );
    GradeService.createGrade(
      { date: '2026-03-10', percentage: 30, title: 'Parcial', type: 'Parcial', value: 4.5 },
      subject.id,
    );

    SemesterService.deleteSemester(semester.id);

    expect(SubjectService.getSubjects()).toHaveLength(0);
    expect(GradeService.getGrades()).toHaveLength(0);
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

  it('rejects the creation of an invalid semester', (): void => {
    expect((): SemesterInterface =>
      SemesterService.createSemester({ ...semesterDTO, name: '' }, 1),
    ).toThrow('Escribe un nombre para identificar el semestre.');
  });
});
