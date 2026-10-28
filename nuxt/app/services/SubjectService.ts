import type { SubjectInterface } from '#shared/interfaces/SubjectInterface.js';

/** Reads subjects from the Nuxt API on the current origin. */
export class SubjectService {
  /** Loads the complete demonstration catalogue. */
  public static getSubjects(): Promise<SubjectInterface[]> {
    return $fetch<SubjectInterface[]>('/api/subjects');
  }

  /** Loads one subject by its identifier. */
  public static getSubjectById(id: number): Promise<SubjectInterface> {
    return $fetch<SubjectInterface>(`/api/subjects/${id}`);
  }
}
