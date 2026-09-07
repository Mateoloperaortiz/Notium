import type { CreateGradeDTO, UpdateGradeDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { useGradeStore } from '@/stores/GradeStore.js';
import { useSubjectStore } from '@/stores/SubjectStore.js';

const generateGradeId = (): string => globalThis.crypto.randomUUID();

export class GradeService {
  public static async findAll(): Promise<GradeInterface[]> {
    return [...useGradeStore().grade];
  }

  public static async findById(id: string): Promise<GradeInterface | undefined> {
    return useGradeStore().grade.find((grade: GradeInterface): boolean => grade.id === id);
  }

  public static async create(dto: CreateGradeDTO, subjectId: string): Promise<GradeInterface> {
    const subject = useSubjectStore().subject.find(
      (currentSubject: SubjectInterface): boolean => currentSubject.id === subjectId,
    );

    if (subject === undefined) {
      throw new Error('La materia no existe.');
    }

    const timestamp = Date.now();
    const grade: GradeInterface = {
      ...dto,
      createdAt: timestamp,
      id: generateGradeId(),
      subject,
      updatetAt: timestamp,
    };

    useGradeStore().grade.push(grade);
    subject.grades.push(grade);

    return grade;
  }

  public static async update(id: string, dto: UpdateGradeDTO): Promise<GradeInterface | undefined> {
    const grade = await GradeService.findById(id);

    if (grade === undefined) {
      return undefined;
    }

    Object.assign(grade, dto, { updatetAt: Date.now() });

    return grade;
  }

  public static async delete(id: string): Promise<boolean> {
    const grades = useGradeStore().grade;
    const gradeIndex = grades.findIndex((grade: GradeInterface): boolean => grade.id === id);

    if (gradeIndex === -1) {
      return false;
    }

    const [grade] = grades.splice(gradeIndex, 1);
    const subjectGradeIndex = grade?.subject.grades.indexOf(grade) ?? -1;

    if (subjectGradeIndex >= 0) {
      grade?.subject.grades.splice(subjectGradeIndex, 1);
    }

    return true;
  }
}
