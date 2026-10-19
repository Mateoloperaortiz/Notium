import type { SubjectInterface } from '../../shared/interfaces/SubjectInterface.js';

/** Provides the read-only demonstration subjects without a database. */
export class SubjectsService {
  private static readonly subjects: SubjectInterface[] = [
    {
      id: 1,
      semesterId: 1,
      code: 'ISAW-01',
      name: 'Ingeniería de Software para Aplicaciones Web',
      credits: 3,
      professor: 'Daniel Correa',
      createdAt: '2026-01-19T08:30:00.000Z',
      updatedAt: '2026-01-19T08:30:00.000Z',
    },
    {
      id: 2,
      semesterId: 1,
      code: 'DAW-01',
      name: 'Desarrollo de Aplicaciones Web',
      credits: 3,
      professor: 'Laura Gómez',
      createdAt: '2026-01-19T08:30:00.000Z',
      updatedAt: '2026-01-19T08:30:00.000Z',
    },
    {
      id: 3,
      semesterId: 2,
      code: 'FAA-01',
      name: 'Fundamentos de Aprendizaje Automático',
      credits: 3,
      professor: 'Andrés Rojas',
      createdAt: '2026-07-27T08:30:00.000Z',
      updatedAt: '2026-07-27T08:30:00.000Z',
    },
  ];

  /** Returns independent copies so consumers cannot mutate the fixture. */
  public static findAll(): SubjectInterface[] {
    return this.subjects.map((subject) => ({ ...subject }));
  }

  /** Resolves a complete positive integer identifier or reports a missing subject. */
  public static findOne(rawId: string | undefined): SubjectInterface {
    const id = Number(rawId);
    const subject = this.subjects.find((item) => item.id === id);

    if (!rawId || !/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id) || !subject) {
      throw createError({ statusCode: 404, statusMessage: 'Materia no encontrada' });
    }

    return { ...subject };
  }
}
