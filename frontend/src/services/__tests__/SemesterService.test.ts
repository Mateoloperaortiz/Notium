import { StatusSemester } from '@/interfaces/SemesterInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
import { describe, expect, it } from 'vitest';

describe('SemesterService.validateFields', (): void => {
  it('accepts valid semester data', (): void => {
    const errors = SemesterService.validateFields({
      name: '2026-1',
      period: 1,
      status: StatusSemester.inProgress,
      year: 2026,
    });

    expect(errors).toEqual({ name: '', period: '', status: '', year: '' });
  });

  it('reports one message per invalid field', (): void => {
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

  it('rejects a name longer than 80 characters', (): void => {
    const errors = SemesterService.validateFields({
      name: 'a'.repeat(81),
      period: 1,
      status: StatusSemester.inProgress,
      year: 2026,
    });

    expect(errors.name).toBe('El nombre no puede superar los 80 caracteres.');
  });
});
