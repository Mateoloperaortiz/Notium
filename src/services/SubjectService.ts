import { mockSubjects } from '@/data/mockData.js';
import type Subject from '@/models/Subject.js';

export class SubjectService {
  private readonly subjects: Subject[];

  public constructor(subjects: Subject[] = mockSubjects) {
    this.subjects = subjects;
  }

  public async findAll(): Promise<Subject[]> {
    return [...this.subjects];
  }

  public async findById(id: string): Promise<Subject | undefined> {
    return this.subjects.find((subject: Subject): boolean => subject.getId() === id);
  }
}

export const subjectService: SubjectService = new SubjectService();

export default subjectService;
