import type {
  PlatformReportFilterDTO,
  SemesterStatusCountDTO,
  UserSummaryDTO,
} from '@/dtos/PlatformReportDTOs.js';
import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import type { UserInterface } from '@/interfaces/UserInterface.js';
import { UserService } from '@/services/UserService.js';

const matchesFilter = (semester: SemesterInterface, filter: PlatformReportFilterDTO): boolean => {
  if (filter.year !== undefined && semester.year !== filter.year) {
    return false;
  }

  return filter.period === undefined || semester.period === filter.period;
};

const averageGradeOf = (semesters: SemesterInterface[]): number | null => {
  const grades = semesters.flatMap((semester: SemesterInterface): number[] =>
    semester.subjects.flatMap((subject: SubjectInterface): number[] =>
      subject.grades.map((grade: GradeInterface): number => grade.value),
    ),
  );

  if (grades.length === 0) {
    return null;
  }

  return grades.reduce((total: number, value: number): number => total + value, 0) / grades.length;
};

export class PlatformReportService {
  public static async getAvailableYears(): Promise<number[]> {
    const users = await UserService.findAll();
    const years = new Set<number>();

    users.forEach((user: UserInterface): void => {
      user.semesters.forEach((semester: SemesterInterface): void => {
        years.add(semester.year);
      });
    });

    return [...years].sort((first: number, second: number): number => second - first);
  }

  public static async getUserSummaries(filter: PlatformReportFilterDTO): Promise<UserSummaryDTO[]> {
    const users = await UserService.findAll();
    const hasFilter = filter.year !== undefined || filter.period !== undefined;

    return users
      .map(
        (user: UserInterface): { filteredSemesters: SemesterInterface[]; user: UserInterface } => ({
          filteredSemesters: user.semesters.filter((semester: SemesterInterface): boolean =>
            matchesFilter(semester, filter),
          ),
          user,
        }),
      )
      .filter(
        ({ filteredSemesters }: { filteredSemesters: SemesterInterface[] }): boolean =>
          !hasFilter || filteredSemesters.length > 0,
      )
      .map(
        ({
          filteredSemesters,
          user,
        }: {
          filteredSemesters: SemesterInterface[];
          user: UserInterface;
        }): UserSummaryDTO => {
          const subjectCount = filteredSemesters.reduce(
            (total: number, semester: SemesterInterface): number =>
              total + semester.subjects.length,
            0,
          );

          return {
            averageGrade: averageGradeOf(filteredSemesters),
            email: user.email,
            id: user.id,
            name: user.name,
            role: user.role,
            semesterCount: filteredSemesters.length,
            subjectCount,
          };
        },
      );
  }

  public static async getSemesterStatusDistribution(
    filter: PlatformReportFilterDTO,
  ): Promise<SemesterStatusCountDTO[]> {
    const users = await UserService.findAll();
    const counts = new Map<StatusSemester, number>(
      Object.values(StatusSemester).map((status: StatusSemester): [StatusSemester, number] => [
        status,
        0,
      ]),
    );

    users.forEach((user: UserInterface): void => {
      user.semesters
        .filter((semester: SemesterInterface): boolean => matchesFilter(semester, filter))
        .forEach((semester: SemesterInterface): void => {
          counts.set(semester.status, (counts.get(semester.status) ?? 0) + 1);
        });
    });

    return [...counts.entries()].map(
      ([status, count]: [StatusSemester, number]): SemesterStatusCountDTO => ({ count, status }),
    );
  }
}
