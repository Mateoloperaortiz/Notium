import { subjects } from '#server/data/subjects.js';
import type { SubjectInterface } from '#shared/interfaces/SubjectInterface.js';

/** Provides the read-only demonstration subjects without a database. */
export class SubjectsService {
  /** Returns the complete demonstration catalogue. */
  public static findAll(): SubjectInterface[] {
    return subjects;
  }

  /** Returns one subject or responds 404 when the identifier does not match any of them. */
  public static findOne(id: number): SubjectInterface {
    const subject = subjects.find((item) => item.id === id);

    if (!subject) {
      throw createError({ statusCode: 404, statusMessage: 'Materia no encontrada' });
    }

    return subject;
  }
}
