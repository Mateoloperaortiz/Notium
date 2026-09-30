import type {
  CreateSemesterDTO,
  SemesterValidationErrorsDTO,
  UpdateSemesterDTO,
} from '@/dtos/SemesterDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { SubjectService } from '@/services/SubjectService.js';
import { useSemesterStore } from '@/stores/SemesterStore.js';
import { IdUtil } from '@/utils/IdUtil.js';

/** Reads and writes semesters in SemesterStore and validates their data. */
export class SemesterService {
  /** Returns the semesters of every user. */
  public static getSemesters(): SemesterInterface[] {
    return useSemesterStore().semesters;
  }

  /** Returns the semester with the given ID, or undefined if it does not exist. */
  public static getSemesterById(id: number): SemesterInterface | undefined {
    return SemesterService.getSemesters().find(
      (semester: SemesterInterface): boolean => semester.id === id,
    );
  }

  /** Returns the semesters that belong to one user. */
  public static getSemestersByUserId(userId: number): SemesterInterface[] {
    return SemesterService.getSemesters().filter(
      (semester: SemesterInterface): boolean => semester.userId === userId,
    );
  }

  /** Validates the data and saves a new semester for the user; throws if invalid. */
  public static createSemester(dto: CreateSemesterDTO, userId: number): SemesterInterface {
    const validatedDto = SemesterService.validate(dto);
    const timestamp = Date.now();
    const semester: SemesterInterface = {
      ...validatedDto,
      createdAt: timestamp,
      id: IdUtil.getNextId(SemesterService.getSemesters()),
      updatedAt: timestamp,
      userId,
    };

    useSemesterStore().semesters.push(semester);

    return semester;
  }

  /** Validates and applies the changes; undefined if the semester does not exist. */
  public static updateSemester(id: number, dto: UpdateSemesterDTO): SemesterInterface | undefined {
    const semester = SemesterService.getSemesterById(id);

    if (semester === undefined) {
      return undefined;
    }

    const validatedDto = SemesterService.validate({
      name: dto.name ?? semester.name,
      period: dto.period ?? semester.period,
      status: dto.status ?? semester.status,
      year: dto.year ?? semester.year,
    });

    Object.assign(semester, validatedDto, { updatedAt: Date.now() });

    return semester;
  }

  /** Deletes the semester and, in cascade, its subjects and grades. */
  public static deleteSemester(id: number): boolean {
    const semesters = SemesterService.getSemesters();
    const semesterIndex = semesters.findIndex(
      (semester: SemesterInterface): boolean => semester.id === id,
    );

    if (semesterIndex === -1) {
      return false;
    }

    semesters.splice(semesterIndex, 1);
    SubjectService.deleteSubjectsBySemesterId(id);

    return true;
  }

  /** Deletes every semester of a user; called when the user is deleted. */
  public static deleteSemestersByUserId(userId: number): void {
    SemesterService.getSemestersByUserId(userId).forEach((semester: SemesterInterface): void => {
      SemesterService.deleteSemester(semester.id);
    });
  }

  /** One message per invalid field; empty strings mean the data is valid. */
  public static validateFields(dto: CreateSemesterDTO): SemesterValidationErrorsDTO {
    const errors: SemesterValidationErrorsDTO = {
      name: '',
      period: '',
      status: '',
      year: '',
    };
    const name = dto.name.trim();

    if (name.length === 0) {
      errors.name = 'Escribe un nombre para identificar el semestre.';
    } else if (name.length > 80) {
      errors.name = 'El nombre no puede superar los 80 caracteres.';
    }

    if (!Number.isInteger(dto.year) || dto.year < 2000) {
      errors.year = 'Ingresa un año válido.';
    }

    if (!Number.isInteger(dto.period) || dto.period < 1 || dto.period > 2) {
      errors.period = 'El periodo debe ser 1 o 2.';
    }

    if (!dto.status) {
      errors.status = 'Selecciona un estado para el semestre.';
    }

    return errors;
  }

  /** Throws the first validation message, or returns the trimmed data. */
  private static validate(dto: CreateSemesterDTO): CreateSemesterDTO {
    const errors = SemesterService.validateFields(dto);
    const firstError = errors.name || errors.year || errors.period || errors.status;

    if (firstError !== '') {
      throw new Error(firstError);
    }

    return {
      name: dto.name.trim(),
      period: dto.period,
      status: dto.status,
      year: dto.year,
    };
  }
}
