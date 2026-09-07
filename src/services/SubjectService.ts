import type { CreateSubjectDTO, UpdateSubjectDTO } from '@/dtos/SubjectDTOs.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { useSemesterStore } from '@/stores/SemesterStore.js';
import { useSubjectStore } from '@/stores/SubjectStore.js';

const generateSubjectId = (): string => globalThis.crypto.randomUUID();

export class SubjectService {
  public static async findAll(): Promise<SubjectInterface[]> {
    return [...useSubjectStore().subject];
  }

  public static async findById(id: string): Promise<SubjectInterface | undefined> {
    return useSubjectStore().subject.find(
      (subject: SubjectInterface): boolean => subject.id === id,
    );
  }

  public static async create(dto: CreateSubjectDTO, semesterId: string): Promise<SubjectInterface> {
    const semester = useSemesterStore().semester.find(
      (currentSemester: SemesterInterface): boolean => currentSemester.id === semesterId,
    );

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
    const subjectIndex = subjects.findIndex(
      (subject: SubjectInterface): boolean => subject.id === id,
    );

    if (subjectIndex === -1) {
      return false;
    }

    const [subject] = subjects.splice(subjectIndex, 1);
    const semesterSubjectIndex = subject?.semester.subjects.indexOf(subject) ?? -1;

    if (semesterSubjectIndex >= 0) {
      subject?.semester.subjects.splice(semesterSubjectIndex, 1);
    }

    return true;
  }
}
