import type { CreateGradeDTO, GradeValidationErrorsDTO, UpdateGradeDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { useGradeStore } from '@/stores/GradeStore.js';
import { IdUtil } from '@/utils/IdUtil.js';

export class GradeService {
  public static getGrades(): GradeInterface[] {
    return useGradeStore().grades;
  }

  public static getGradeById(id: number): GradeInterface | undefined {
    return GradeService.getGrades().find((grade: GradeInterface): boolean => grade.id === id);
  }

  public static getGradesBySubjectId(subjectId: number): GradeInterface[] {
    return GradeService.getGrades().filter(
      (grade: GradeInterface): boolean => grade.subjectId === subjectId,
    );
  }

  public static getGradesBySubjects(subjects: SubjectInterface[]): GradeInterface[] {
    const subjectIds = subjects.map((subject: SubjectInterface): number => subject.id);

    return GradeService.getGrades().filter((grade: GradeInterface): boolean =>
      subjectIds.includes(grade.subjectId),
    );
  }

  public static createGrade(dto: CreateGradeDTO, subjectId: number): GradeInterface {
    const validatedDto = GradeService.validate(dto);
    const timestamp = Date.now();
    const grade: GradeInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: IdUtil.getNextId(GradeService.getGrades()),
      subjectId,
      updatedAt: timestamp,
    };

    useGradeStore().grades.push(grade);

    return grade;
  }

  public static updateGrade(id: number, dto: UpdateGradeDTO): GradeInterface | undefined {
    const grade = GradeService.getGradeById(id);

    if (grade === undefined) {
      return undefined;
    }

    const validatedDto = GradeService.validate({
      date: dto.date ?? grade.date,
      percentage: dto.percentage ?? grade.percentage,
      title: dto.title ?? grade.title,
      type: dto.type ?? grade.type,
      value: dto.value ?? grade.value,
    });

    Object.assign(grade, validatedDto, { updatedAt: Date.now() });

    return grade;
  }

  public static deleteGrade(id: number): boolean {
    const grades = GradeService.getGrades();
    const gradeIndex = grades.findIndex((grade: GradeInterface): boolean => grade.id === id);

    if (gradeIndex === -1) {
      return false;
    }

    grades.splice(gradeIndex, 1);

    return true;
  }

  public static deleteGradesBySubjectId(subjectId: number): void {
    GradeService.getGradesBySubjectId(subjectId).forEach((grade: GradeInterface): void => {
      GradeService.deleteGrade(grade.id);
    });
  }

  public static validateFields(dto: CreateGradeDTO): GradeValidationErrorsDTO {
    return {
      date: Number.isNaN(Date.parse(dto.date)) ? 'Ingresa una fecha válida.' : '',
      percentage:
        Number.isInteger(dto.percentage) && dto.percentage > 0 && dto.percentage <= 100
          ? ''
          : 'El porcentaje debe estar entre 1 y 100.',
      title: dto.title.trim() ? '' : 'El título es obligatorio.',
      type: dto.type.trim() ? '' : 'El tipo es obligatorio.',
      value:
        Number.isFinite(dto.value) && dto.value >= 0 && dto.value <= 5
          ? ''
          : 'La nota debe estar entre 0 y 5.',
    };
  }

  private static validate(dto: CreateGradeDTO): CreateGradeDTO {
    const errors = GradeService.validateFields(dto);
    const firstError =
      errors.title || errors.type || errors.value || errors.percentage || errors.date;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      date: dto.date,
      percentage: dto.percentage,
      title: dto.title.trim(),
      type: dto.type.trim(),
      value: dto.value,
    };
  }
}
