import { GradeService } from '@/services/GradeService.js';
import { describe, expect, it } from 'vitest';

describe('GradeService.validateFields', (): void => {
  it('accepts valid grade data', (): void => {
    const errors = GradeService.validateFields({
      date: '2026-03-01',
      percentage: 20,
      subjectId: 1,
      title: 'Parcial 1',
      type: 'Parcial',
      value: 4.5,
    });

    expect(errors).toEqual({ date: '', percentage: '', title: '', type: '', value: '' });
  });

  it('reports one message per invalid field', (): void => {
    const errors = GradeService.validateFields({
      date: 'sin fecha',
      percentage: 120,
      subjectId: 1,
      title: '',
      type: ' ',
      value: 6,
    });

    expect(errors).toEqual({
      date: 'Ingresa una fecha válida.',
      percentage: 'El porcentaje debe estar entre 1 y 100.',
      title: 'El título es obligatorio.',
      type: 'El tipo es obligatorio.',
      value: 'La nota debe estar entre 0 y 5.',
    });
  });
});
