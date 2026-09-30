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

/** Calculations for the analytics page and the dashboard charts, on data they receive. */
export class AnalyticsUtil {
  /** Plain mean of the values, or null when the list is empty. */
  public static getAverage(values: number[]): number | null {
    if (values.length === 0) {
      return null;
    }

    return (
      values.reduce((total: number, value: number): number => total + value, 0) / values.length
    );
  }

  /** Label such as "2026-1 (2026-1)": name, then year and period. */
  public static getSemesterLabel(semester: SemesterInterface): string {
    return `${semester.name} (${semester.year}-${semester.period})`;
  }

  /** Options for the semester selector, newest first. */
  public static getSemesterOptions(semesters: SemesterInterface[]): SemesterOptionDTO[] {
    return [...semesters]
      .sort(
        (first: SemesterInterface, second: SemesterInterface): number =>
          second.year - first.year || second.period - first.period,
      )
      .map((semester: SemesterInterface): SemesterOptionDTO => ({
        id: semester.id,
        label: AnalyticsUtil.getSemesterLabel(semester),
      }));
  }

  /** Distinct assessment types, sorted alphabetically. */
  public static getGradeTypes(grades: GradeInterface[]): string[] {
    const types = new Set<string>(grades.map((grade: GradeInterface): string => grade.type));

    return [...types].sort((first: string, second: string): number => first.localeCompare(second));
  }

  /** Grades of the given subjects that match the semester and type filters. */
  public static filterGrades(
    grades: GradeInterface[],
    subjects: SubjectInterface[],
    filter: AnalyticsFilterDTO,
  ): GradeInterface[] {
    const subjectIds = subjects
      .filter(
        (subject: SubjectInterface): boolean =>
          filter.semesterId === undefined || subject.semesterId === filter.semesterId,
      )
      .map((subject: SubjectInterface): number => subject.id);

    return grades.filter(
      (grade: GradeInterface): boolean =>
        subjectIds.includes(grade.subjectId) &&
        (filter.type === undefined || grade.type === filter.type),
    );
  }

  /** Grades in date order, for the evolution chart. */
  public static getEvolutionSeries(grades: GradeInterface[]): EvolutionPointDTO[] {
    return [...grades]
      .sort((first: GradeInterface, second: GradeInterface): number =>
        first.date.localeCompare(second.date),
      )
      .map((grade: GradeInterface): EvolutionPointDTO => ({
        label: grade.title,
        value: grade.value,
      }));
  }

  /** Average grade of each assessment type. */
  public static getTypeAverages(grades: GradeInterface[]): TypeAverageDTO[] {
    return AnalyticsUtil.getGradeTypes(grades).map((type: string): TypeAverageDTO => ({
      average:
        AnalyticsUtil.getAverage(
          grades
            .filter((grade: GradeInterface): boolean => grade.type === type)
            .map((grade: GradeInterface): number => grade.value),
        ) ?? 0,
      type,
    }));
  }

  /** One comparison row per semester that matches the filters, sorted by label. */
  public static getSemesterComparison(
    semesters: SemesterInterface[],
    subjects: SubjectInterface[],
    grades: GradeInterface[],
    filter: AnalyticsFilterDTO,
  ): SemesterComparisonRowDTO[] {
    return semesters
      .filter(
        (semester: SemesterInterface): boolean =>
          filter.semesterId === undefined || semester.id === filter.semesterId,
      )
      .map((semester: SemesterInterface): SemesterComparisonRowDTO => {
        const semesterSubjects = subjects.filter(
          (subject: SubjectInterface): boolean => subject.semesterId === semester.id,
        );
        const semesterGrades = AnalyticsUtil.filterGrades(grades, semesterSubjects, {
          type: filter.type,
        });

        return {
          averageGrade: AnalyticsUtil.getAverage(
            semesterGrades.map((grade: GradeInterface): number => grade.value),
          ),
          gradeCount: semesterGrades.length,
          semesterId: semester.id,
          semesterLabel: AnalyticsUtil.getSemesterLabel(semester),
          subjectCount: semesterSubjects.length,
        };
      })
      .sort((first: SemesterComparisonRowDTO, second: SemesterComparisonRowDTO): number =>
        first.semesterLabel.localeCompare(second.semesterLabel),
      );
  }
}
