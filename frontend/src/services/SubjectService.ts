import type {
  CreateSubjectDTO,
  SubjectValidationErrorsDTO,
  UpdateSubjectDTO,
} from '@/dtos/SubjectDTOs.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { BaseService } from '@/services/BaseService.js';

/** Reads and writes the subjects of the session user through the API. */
export class SubjectService extends BaseService {
  /** Returns every subject of the session user. */
  public static async getSubjects(): Promise<SubjectInterface[]> {
    const { data } = await SubjectService.getClient().get<SubjectInterface[]>('/subjects');

    return data;
  }

  /** Returns the subjects of one semester of the session user. */
  public static async getSubjectsBySemesterId(semesterId: number): Promise<SubjectInterface[]> {
    const { data } = await SubjectService.getClient().get<SubjectInterface[]>('/subjects', {
      params: { semesterId },
    });

    return data;
  }

  /** Returns one subject of the session user. */
  public static async getSubjectById(id: number): Promise<SubjectInterface> {
    const { data } = await SubjectService.getClient().get<SubjectInterface>(`/subjects/${id}`);

    return data;
  }

  /** Creates a subject in a semester the session user owns. */
  public static async createSubject(dto: CreateSubjectDTO): Promise<SubjectInterface> {
    const { data } = await SubjectService.getClient().post<SubjectInterface>('/subjects', dto);

    return data;
  }

  /** Applies changes to a subject of the session user. */
  public static async updateSubject(id: number, dto: UpdateSubjectDTO): Promise<SubjectInterface> {
    const { data } = await SubjectService.getClient().patch<SubjectInterface>(
      `/subjects/${id}`,
      dto,
    );

    return data;
  }

  /** Deletes a subject of the session user and, in cascade, its grades. */
  public static async deleteSubject(id: number): Promise<void> {
    await SubjectService.getClient().delete(`/subjects/${id}`);
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
}
