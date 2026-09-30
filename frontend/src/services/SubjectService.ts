import type {
  CreateSubjectDTO,
  SubjectValidationErrorsDTO,
  UpdateSubjectDTO,
} from '@/dtos/SubjectDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { GradeService } from '@/services/GradeService.js';
import { useSubjectStore } from '@/stores/SubjectStore.js';
import { IdUtil } from '@/utils/IdUtil.js';

/** Reads and writes subjects in SubjectStore and validates their data. */
export class SubjectService {
  /** Returns the subjects of every user. */
  public static getSubjects(): SubjectInterface[] {
    return useSubjectStore().subjects;
  }

  /** Returns the subject with the given ID, or undefined if it does not exist. */
  public static getSubjectById(id: number): SubjectInterface | undefined {
    return SubjectService.getSubjects().find(
      (subject: SubjectInterface): boolean => subject.id === id,
    );
  }

  /** Returns the subjects of one semester. */
  public static getSubjectsBySemesterId(semesterId: number): SubjectInterface[] {
    return SubjectService.getSubjects().filter(
      (subject: SubjectInterface): boolean => subject.semesterId === semesterId,
    );
  }

  /** Returns the subjects of the given semesters, such as those of one user. */
  public static getSubjectsBySemesters(semesters: SemesterInterface[]): SubjectInterface[] {
    const semesterIds = semesters.map((semester: SemesterInterface): number => semester.id);

    return SubjectService.getSubjects().filter((subject: SubjectInterface): boolean =>
      semesterIds.includes(subject.semesterId),
    );
  }

  /** Validates the data and saves a new subject in the semester; throws if invalid. */
  public static createSubject(dto: CreateSubjectDTO, semesterId: number): SubjectInterface {
    const validatedDto = SubjectService.validate(dto);
    const timestamp = Date.now();
    const subject: SubjectInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: IdUtil.getNextId(SubjectService.getSubjects()),
      semesterId,
      updatedAt: timestamp,
    };

    useSubjectStore().subjects.push(subject);

    return subject;
  }

  /** Validates and applies the changes; undefined if the subject does not exist. */
  public static updateSubject(id: number, dto: UpdateSubjectDTO): SubjectInterface | undefined {
    const subject = SubjectService.getSubjectById(id);

    if (subject === undefined) {
      return undefined;
    }

    const validatedDto = SubjectService.validate({
      code: dto.code ?? subject.code,
      credits: dto.credits ?? subject.credits,
      name: dto.name ?? subject.name,
      professor: dto.professor ?? subject.professor,
    });

    Object.assign(subject, validatedDto, { updatedAt: Date.now() });

    return subject;
  }

  /** Deletes the subject and, in cascade, its grades. */
  public static deleteSubject(id: number): boolean {
    const subjects = SubjectService.getSubjects();
    const subjectIndex = subjects.findIndex(
      (subject: SubjectInterface): boolean => subject.id === id,
    );

    if (subjectIndex === -1) {
      return false;
    }

    subjects.splice(subjectIndex, 1);
    GradeService.deleteGradesBySubjectId(id);

    return true;
  }

  /** Deletes every subject of a semester; called when the semester is deleted. */
  public static deleteSubjectsBySemesterId(semesterId: number): void {
    SubjectService.getSubjectsBySemesterId(semesterId).forEach(
      (subject: SubjectInterface): void => {
        SubjectService.deleteSubject(subject.id);
      },
    );
  }

  /** One message per invalid field; empty strings mean the data is valid. */
  public static validateFields(dto: CreateSubjectDTO): SubjectValidationErrorsDTO {
    return {
      code: dto.code.trim() ? '' : 'El código es obligatorio.',
      credits:
        Number.isInteger(dto.credits) && dto.credits > 0
          ? ''
          : 'Los créditos deben ser un número entero mayor que cero.',
      name: dto.name.trim() ? '' : 'El nombre es obligatorio.',
      professor: dto.professor.trim() ? '' : 'El profesor es obligatorio.',
    };
  }

  /** Throws the first validation message, or returns the trimmed data. */
  private static validate(dto: CreateSubjectDTO): CreateSubjectDTO {
    const errors = SubjectService.validateFields(dto);
    const firstError = errors.code || errors.name || errors.credits || errors.professor;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      code: dto.code.trim(),
      credits: dto.credits,
      name: dto.name.trim(),
      professor: dto.professor.trim(),
    };
  }
}
