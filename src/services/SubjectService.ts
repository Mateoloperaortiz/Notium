import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { useSubjectStore } from '@/stores/SubjectStore.js';

export class SubjectService {
  public static async findAll(): Promise<SubjectInterface[]> {
    return [...useSubjectStore().subject];
  }

  public static async findById(id: string): Promise<SubjectInterface | undefined> {
    return useSubjectStore().subject.find(
      (subject: SubjectInterface): boolean => subject.id === id,
    );
  }
}
