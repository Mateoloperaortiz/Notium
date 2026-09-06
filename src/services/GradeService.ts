import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { useGradeStore } from '@/stores/GradeStore.js';

export class GradeService {
  public static async findAll(): Promise<GradeInterface[]> {
    return [...useGradeStore().grade];
  }

  public static async findById(id: string): Promise<GradeInterface | undefined> {
    return useGradeStore().grade.find((grade: GradeInterface): boolean => grade.id === id);
  }
}
