import type {
  CreateSubjectDTO,
  SubjectValidationErrorsDTO,
  UpdateSubjectDTO,
} from '@/dtos/SubjectDTOs.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { SemesterService } from '@/services/SemesterService.js';
import { useAuthStore } from '@/stores/AuthStore.js';
import { useSubjectStore } from '@/stores/SubjectStore.js';

const generateSubjectId = (): string => globalThis.crypto.randomUUID();

export class SubjectService {
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

  public static async findAll(): Promise<SubjectInterface[]> {
    return [...useSubjectStore().subject];
  }

  public static async findAllByCurrentUser(): Promise<SubjectInterface[]> {
    const currentUser = useAuthStore().currentUser;

    if (currentUser === null) {
      return [];
    }

    return useSubjectStore().subject.filter(
      (subject: SubjectInterface): boolean => subject.semester.user.id === currentUser.id,
    );
  }

  public static async findBySemesterId(semesterId: string): Promise<SubjectInterface[]> {
    const subjects = await SubjectService.findAllByCurrentUser();

    return subjects.filter(
      (subject: SubjectInterface): boolean => subject.semester.id === semesterId,
    );
  }

  public static async findById(id: string): Promise<SubjectInterface | undefined> {
    const subjects = await SubjectService.findAllByCurrentUser();

    return subjects.find((subject: SubjectInterface): boolean => subject.id === id);
  }

  public static async create(dto: CreateSubjectDTO, semesterId: string): Promise<SubjectInterface> {
    const semester = await SemesterService.findById(semesterId);

    if (semester === undefined) {
      throw new Error('El semestre no existe.');
    }

    const timestamp = Date.now();
    const subject: SubjectInterface = {
      ...dto,
      createdAt: timestamp,
      grades: [],
      id: generateSubjectId(),
      semester,
      updatedAt: timestamp,
    };

    useSubjectStore().subject.push(subject);
    semester.subjects.push(subject);

    return subject;
  }

  public static async update(
    id: string,
    dto: UpdateSubjectDTO,
  ): Promise<SubjectInterface | undefined> {
    const subject = await SubjectService.findById(id);

    if (subject === undefined) {
      return undefined;
    }

    Object.assign(subject, dto, { updatedAt: Date.now() });

    return subject;
  }

  public static async delete(id: string): Promise<boolean> {
    const subjects = useSubjectStore().subject;
    const subject = await SubjectService.findById(id);
    const subjectIndex = subject === undefined ? -1 : subjects.indexOf(subject);

    if (subjectIndex === -1) {
      return false;
    }

    const [removedSubject] = subjects.splice(subjectIndex, 1);
    const semesterSubjectIndex = removedSubject?.semester.subjects.indexOf(removedSubject) ?? -1;

    if (semesterSubjectIndex >= 0) {
      removedSubject?.semester.subjects.splice(semesterSubjectIndex, 1);
    }

    return true;
  }
}
