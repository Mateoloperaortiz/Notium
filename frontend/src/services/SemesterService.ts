import type {
  CreateSemesterDTO,
  SemesterValidationErrorsDTO,
  UpdateSemesterDTO,
} from '@/dtos/SemesterDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import { BaseService } from '@/services/BaseService.js';

/** Reads and writes the semesters of the session user through the API. */
export class SemesterService extends BaseService {
  /** Returns the semesters of the session user. */
  public static async getSemesters(): Promise<SemesterInterface[]> {
    const { data } = await SemesterService.getClient().get<SemesterInterface[]>('/semesters');

    return data;
  }

  /** Returns one semester of the session user. */
  public static async getSemesterById(id: number): Promise<SemesterInterface> {
    const { data } = await SemesterService.getClient().get<SemesterInterface>(`/semesters/${id}`);

    return data;
  }

  /** Creates a semester for the session user. */
  public static async createSemester(dto: CreateSemesterDTO): Promise<SemesterInterface> {
    const { data } = await SemesterService.getClient().post<SemesterInterface>('/semesters', dto);

    return data;
  }

  /** Applies changes to a semester of the session user. */
  public static async updateSemester(
    id: number,
    dto: UpdateSemesterDTO,
  ): Promise<SemesterInterface> {
    const { data } = await SemesterService.getClient().patch<SemesterInterface>(
      `/semesters/${id}`,
      dto,
    );

    return data;
  }

  /** Deletes a semester of the session user and, in cascade, its subjects and grades. */
  public static async deleteSemester(id: number): Promise<void> {
    await SemesterService.getClient().delete(`/semesters/${id}`);
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
}
