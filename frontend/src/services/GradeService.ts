import type { CreateGradeDTO, GradeValidationErrorsDTO, UpdateGradeDTO } from '@/dtos/GradeDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { BaseService } from '@/services/BaseService.js';

/** Reads and writes the grades of the session user through the API. */
export class GradeService extends BaseService {
  /** Returns every grade of the session user. */
  public static async getGrades(): Promise<GradeInterface[]> {
    const { data } = await GradeService.getClient().get<GradeInterface[]>('/grades');

    return data;
  }

  /** Returns the grades of one subject of the session user. */
  public static async getGradesBySubjectId(subjectId: number): Promise<GradeInterface[]> {
    const { data } = await GradeService.getClient().get<GradeInterface[]>('/grades', {
      params: { subjectId },
    });

    return data;
  }

  /** Returns one grade of the session user. */
  public static async getGradeById(id: number): Promise<GradeInterface> {
    const { data } = await GradeService.getClient().get<GradeInterface>(`/grades/${id}`);

    return data;
  }

  /** Creates a grade in a subject the session user owns. */
  public static async createGrade(dto: CreateGradeDTO): Promise<GradeInterface> {
    const { data } = await GradeService.getClient().post<GradeInterface>('/grades', dto);

    return data;
  }

  /** Applies changes to a grade of the session user. */
  public static async updateGrade(id: number, dto: UpdateGradeDTO): Promise<GradeInterface> {
    const { data } = await GradeService.getClient().patch<GradeInterface>(`/grades/${id}`, dto);

    return data;
  }

  /** Deletes a grade of the session user. */
  public static async deleteGrade(id: number): Promise<void> {
    await GradeService.getClient().delete(`/grades/${id}`);
  }

  /** One message per invalid field; empty strings mean the data is valid. */
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
}
