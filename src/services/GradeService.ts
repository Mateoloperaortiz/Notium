import type { CreateGradeDTO, GradeValidationErrorsDTO, UpdateGradeDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { SubjectService } from '@/services/SubjectService.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useGradeStore } from '@/stores/GradeStore.js';

const generateGradeId = (): string => globalThis.crypto.randomUUID();

export class GradeService {
  public static async findAll(): Promise<GradeInterface[]> {
    return [...useGradeStore().grade];
  }

  public static async findAllByCurrentUser(): Promise<GradeInterface[]> {
    const currentUser = useAuthStore().currentUser;

    if (currentUser === null) {
      return [];
    }

    return (await GradeService.findAll()).filter(
      (grade: GradeInterface): boolean => grade.subject.semester.user.id === currentUser.id,
    );
  }

  public static async findBySubjectId(subjectId: string): Promise<GradeInterface[]> {
    const grades = await GradeService.findAllByCurrentUser();

    return grades.filter((grade: GradeInterface): boolean => grade.subject.id === subjectId);
  }

  public static async findById(id: string): Promise<GradeInterface | undefined> {
    const grades = await GradeService.findAllByCurrentUser();

    return grades.find((grade: GradeInterface): boolean => grade.id === id);
  }

  public static async create(dto: CreateGradeDTO, subjectId: string): Promise<GradeInterface> {
    const subject = await SubjectService.findById(subjectId);

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
    const grade = await GradeService.findById(id);
    const gradeIndex = grade === undefined ? -1 : grades.indexOf(grade);

    if (gradeIndex === -1) {
      return false;
    }

    const [removedGrade] = grades.splice(gradeIndex, 1);
    const subjectGradeIndex = removedGrade?.subject.grades.indexOf(removedGrade) ?? -1;

    if (subjectGradeIndex >= 0) {
      removedGrade?.subject.grades.splice(subjectGradeIndex, 1);
    }

    return true;
  }

  public static validateFields(dto: CreateGradeDTO): GradeValidationErrorsDTO {
    return {
      date: Number.isNaN(dto.date.getTime()) ? 'Ingresa una fecha válida.' : '',
      percentage:
        Number.isInteger(dto.percentage) && dto.percentage > 0 && dto.percentage <= 100
          ? ''
          : 'El porcentaje debe estar entre 1 y 100.',
      title: dto.title.trim() ? '' : 'El título es obligatorio.',
      type: dto.type.trim() ? '' : 'El tipo es obligatorio.',
      value: dto.value >= 0 && dto.value <= 5 ? '' : 'La nota debe estar entre 0 y 5.',
    };
  }
}
