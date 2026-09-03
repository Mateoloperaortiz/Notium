import { mockGrades } from '@/data/mockData';
import type Grade from '@/models/Grade';

export class GradeService {
  private readonly grades: Grade[];

  public constructor(grades: Grade[] = mockGrades) {
    this.grades = grades;
  }

  public async findAll(): Promise<Grade[]> {
    return [...this.grades];
  }

  public async findById(id: string): Promise<Grade | undefined> {
    return this.grades.find((grade: Grade): boolean => grade.getId() === id);
  }
}

export const gradeService = new GradeService();

export default gradeService;
