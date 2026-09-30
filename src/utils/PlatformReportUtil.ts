import type {
  PlatformReportFilterDTO,
  SemesterStatusCountDTO,
  UserSummaryDTO,
} from '@/dtos/PlatformReportDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { AnalyticsUtil } from '@/utils/AnalyticsUtil.js';

export class PlatformReportUtil {
  public static getAvailableYears(semesters: SemesterInterface[]): number[] {
    const years = new Set<number>(
      semesters.map((semester: SemesterInterface): number => semester.year),
    );

    return [...years].sort((first: number, second: number): number => second - first);
  }

  public static filterSemesters(
    semesters: SemesterInterface[],
    filter: PlatformReportFilterDTO,
  ): SemesterInterface[] {
    return semesters.filter(
      (semester: SemesterInterface): boolean =>
        (filter.year === undefined || semester.year === filter.year) &&
        (filter.period === undefined || semester.period === filter.period),
    );
  }

  public static getUserSummaries(
    users: UserInterface[],
    semesters: SemesterInterface[],
    subjects: SubjectInterface[],
    grades: GradeInterface[],
    filter: PlatformReportFilterDTO,
  ): UserSummaryDTO[] {
    const hasFilter = filter.year !== undefined || filter.period !== undefined;
    const filteredSemesters = PlatformReportUtil.filterSemesters(semesters, filter);

    return users
      .map((user: UserInterface): UserSummaryDTO => {
        const semesterIds = filteredSemesters
          .filter((semester: SemesterInterface): boolean => semester.userId === user.id)
          .map((semester: SemesterInterface): number => semester.id);
        const subjectIds = subjects
          .filter((subject: SubjectInterface): boolean => semesterIds.includes(subject.semesterId))
          .map((subject: SubjectInterface): number => subject.id);
        const gradeValues = grades
          .filter((grade: GradeInterface): boolean => subjectIds.includes(grade.subjectId))
          .map((grade: GradeInterface): number => grade.value);

        return {
          averageGrade: AnalyticsUtil.getAverage(gradeValues),
          email: user.email,
          id: user.id,
          name: user.name,
          role: user.role,
          semesterCount: semesterIds.length,
          subjectCount: subjectIds.length,
        };
      })
      .filter((summary: UserSummaryDTO): boolean => !hasFilter || summary.semesterCount > 0);
  }

  public static getSemesterStatusDistribution(
    semesters: SemesterInterface[],
    filter: PlatformReportFilterDTO,
  ): SemesterStatusCountDTO[] {
    const filteredSemesters = PlatformReportUtil.filterSemesters(semesters, filter);

    return Object.values(StatusSemester).map((status: StatusSemester): SemesterStatusCountDTO => ({
      count: filteredSemesters.filter(
        (semester: SemesterInterface): boolean => semester.status === status,
      ).length,
      status,
    }));
  }
}
