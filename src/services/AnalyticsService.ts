import type {
  AnalyticsFilterDTO,
  EvolutionPointDTO,
  SemesterComparisonRowDTO,
  SemesterOptionDTO,
  TypeAverageDTO,
} from '@/dtos/AnalyticsDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import type { SemesterInterface } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';

const semesterLabelOf = (semester: SemesterInterface): string =>
  `${semester.name} (${semester.year}-${semester.period})`;

const flattenGrades = (user: UserInterface): GradeInterface[] =>
  user.semesters.flatMap((semester: SemesterInterface): GradeInterface[] =>
    semester.subjects.flatMap((subject: SubjectInterface): GradeInterface[] => subject.grades),
  );

const matchesFilter = (grade: GradeInterface, filter: AnalyticsFilterDTO): boolean => {
  if (filter.semesterId !== undefined && grade.subject.semester.id !== filter.semesterId) {
    return false;
  }

  return filter.type === undefined || grade.type === filter.type;
};

const averageOf = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((total: number, value: number): number => total + value, 0) / values.length;
};

export class AnalyticsService {
  public static getSemesterOptions(user: UserInterface): SemesterOptionDTO[] {
    return [...user.semesters]
      .sort(
        (first: SemesterInterface, second: SemesterInterface): number =>
          second.year - first.year || second.period - first.period,
      )
      .map((semester: SemesterInterface): SemesterOptionDTO => ({
        id: semester.id,
        label: semesterLabelOf(semester),
      }));
  }

  public static getGradeTypes(user: UserInterface): string[] {
    const types = new Set<string>(
      flattenGrades(user).map((grade: GradeInterface): string => grade.type),
    );

    return [...types].sort((first: string, second: string): number => first.localeCompare(second));
  }

  public static getEvolutionSeries(
    user: UserInterface,
    filter: AnalyticsFilterDTO,
  ): EvolutionPointDTO[] {
    return flattenGrades(user)
      .filter((grade: GradeInterface): boolean => matchesFilter(grade, filter))
      .sort(
        (first: GradeInterface, second: GradeInterface): number =>
          new Date(first.date).getTime() - new Date(second.date).getTime(),
      )
      .map((grade: GradeInterface): EvolutionPointDTO => ({
        date: new Date(grade.date).toISOString(),
        label: grade.title,
        value: grade.value,
      }));
  }

  public static getTypeAverages(user: UserInterface, filter: AnalyticsFilterDTO): TypeAverageDTO[] {
    const grades = flattenGrades(user).filter((grade: GradeInterface): boolean =>
      matchesFilter(grade, filter),
    );
    const valuesByType = new Map<string, number[]>();

    grades.forEach((grade: GradeInterface): void => {
      const values = valuesByType.get(grade.type) ?? [];
      values.push(grade.value);
      valuesByType.set(grade.type, values);
    });

    return [...valuesByType.entries()]
      .map(([type, values]: [string, number[]]): TypeAverageDTO => ({
        average: averageOf(values) ?? 0,
        type,
      }))
      .sort((first: TypeAverageDTO, second: TypeAverageDTO): number =>
        first.type.localeCompare(second.type),
      );
  }

  public static getSemesterComparison(
    user: UserInterface,
    filter: AnalyticsFilterDTO,
  ): SemesterComparisonRowDTO[] {
    return user.semesters
      .filter(
        (semester: SemesterInterface): boolean =>
          filter.semesterId === undefined || semester.id === filter.semesterId,
      )
      .map((semester: SemesterInterface): SemesterComparisonRowDTO => {
        const grades = semester.subjects
          .flatMap((subject: SubjectInterface): GradeInterface[] => subject.grades)
          .filter(
            (grade: GradeInterface): boolean =>
              filter.type === undefined || grade.type === filter.type,
          );

        return {
          averageGrade: averageOf(grades.map((grade: GradeInterface): number => grade.value)),
          gradeCount: grades.length,
          semesterId: semester.id,
          semesterLabel: semesterLabelOf(semester),
          subjectCount: semester.subjects.length,
        };
      })
      .sort((first: SemesterComparisonRowDTO, second: SemesterComparisonRowDTO): number =>
        first.semesterLabel.localeCompare(second.semesterLabel),
      );
  }
}
