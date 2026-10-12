import { SubjectService } from '@/services/SubjectService.js';
import { describe, expect, it } from 'vitest';

describe('SubjectService.validateFields', (): void => {
  it('accepts valid subject data', (): void => {
    const errors = SubjectService.validateFields({
      code: 'SI2001',
      credits: 3,
      name: 'Desarrollo Web',
      professor: 'Daniel Correa',
      semesterId: 1,
    });

    expect(errors).toEqual({ code: '', credits: '', name: '', professor: '' });
  });

  it('reports one message per invalid field', (): void => {
    const errors = SubjectService.validateFields({
      code: ' ',
      credits: 0,
      name: '',
      professor: '  ',
      semesterId: 1,
    });

    expect(errors).toEqual({
      code: 'El código es obligatorio.',
      credits: 'Los créditos deben ser un número entero mayor que cero.',
      name: 'El nombre es obligatorio.',
      professor: 'El profesor es obligatorio.',
    });
  });
});
