import { GradeType, SemesterStatus, UserRole } from '@/models'

export interface SeedGrade {
  title: string
  value: number
  percentage: number
  type: GradeType
  date: string
}

export interface SeedSubject {
  code: string
  name: string
  credits: number
  professor: string
  grades: SeedGrade[]
}

export interface SeedSemester {
  name: string
  year: number
  period: number
  status: SemesterStatus
  subjects: SeedSubject[]
}

export interface SeedUser {
  name: string
  email: string
  password: string
  role: UserRole
  semesters: SeedSemester[]
}

/** Meses tipicos de cada corte evaluativo segun el periodo academico. */
function evaluationDate(year: number, period: number, cut: number): string {
  const months = period === 1 ? ['02', '03', '04', '05'] : ['08', '09', '10', '11']
  return `${year}-${months[cut]}-15`
}

/** Plan evaluativo completo (100 %) de una materia ya finalizada. */
function completedPlan(
  year: number,
  period: number,
  scores: { first: number; second: number; project: number; final: number },
): SeedGrade[] {
  return [
    {
      title: 'Primer parcial',
      value: scores.first,
      percentage: 25,
      type: GradeType.Partial,
      date: evaluationDate(year, period, 0),
    },
    {
      title: 'Segundo parcial',
      value: scores.second,
      percentage: 25,
      type: GradeType.Partial,
      date: evaluationDate(year, period, 1),
    },
    {
      title: 'Proyecto de curso',
      value: scores.project,
      percentage: 20,
      type: GradeType.Project,
      date: evaluationDate(year, period, 2),
    },
    {
      title: 'Examen final',
      value: scores.final,
      percentage: 30,
      type: GradeType.Final,
      date: evaluationDate(year, period, 3),
    },
  ]
}

/** Plan evaluativo parcial (50 %) de una materia en curso: deja porcentaje pendiente. */
function inProgressPlan(
  year: number,
  period: number,
  scores: { quiz: number; homework: number; first: number },
): SeedGrade[] {
  return [
    {
      title: 'Quiz de diagnostico',
      value: scores.quiz,
      percentage: 10,
      type: GradeType.Quiz,
      date: evaluationDate(year, period, 0),
    },
    {
      title: 'Taller en clase',
      value: scores.homework,
      percentage: 15,
      type: GradeType.Homework,
      date: evaluationDate(year, period, 1),
    },
    {
      title: 'Primer parcial',
      value: scores.first,
      percentage: 25,
      type: GradeType.Partial,
      date: evaluationDate(year, period, 2),
    },
  ]
}

export const SEED_USERS: readonly SeedUser[] = [
  {
    name: 'Mateo Lopera',
    email: 'mateo@notium.dev',
    password: 'notium123',
    role: UserRole.Student,
    semesters: [
      {
        name: 'Semestre 1',
        year: 2024,
        period: 1,
        status: SemesterStatus.Completed,
        subjects: [
          {
            code: 'MAT101',
            name: 'Calculo diferencial',
            credits: 4,
            professor: 'Laura Restrepo',
            grades: completedPlan(2024, 1, { first: 3.4, second: 3.8, project: 4.2, final: 3.6 }),
          },
          {
            code: 'PRG101',
            name: 'Fundamentos de programacion',
            credits: 4,
            professor: 'Carlos Mejia',
            grades: completedPlan(2024, 1, { first: 4.5, second: 4.7, project: 4.9, final: 4.6 }),
          },
          {
            code: 'HUM101',
            name: 'Comunicacion escrita',
            credits: 2,
            professor: 'Ana Gomez',
            grades: completedPlan(2024, 1, { first: 4.0, second: 3.9, project: 4.3, final: 4.1 }),
          },
          {
            code: 'FIS101',
            name: 'Fisica mecanica',
            credits: 3,
            professor: 'Julian Vargas',
            grades: completedPlan(2024, 1, { first: 2.8, second: 3.1, project: 3.5, final: 3.0 }),
          },
        ],
      },
      {
        name: 'Semestre 2',
        year: 2024,
        period: 2,
        status: SemesterStatus.Completed,
        subjects: [
          {
            code: 'MAT201',
            name: 'Calculo integral',
            credits: 4,
            professor: 'Laura Restrepo',
            grades: completedPlan(2024, 2, { first: 3.9, second: 4.1, project: 4.4, final: 4.0 }),
          },
          {
            code: 'PRG201',
            name: 'Programacion orientada a objetos',
            credits: 4,
            professor: 'Carlos Mejia',
            grades: completedPlan(2024, 2, { first: 4.6, second: 4.8, project: 5.0, final: 4.7 }),
          },
          {
            code: 'EST201',
            name: 'Estadistica descriptiva',
            credits: 3,
            professor: 'Diana Cardona',
            grades: completedPlan(2024, 2, { first: 3.2, second: 3.5, project: 3.8, final: 3.3 }),
          },
          {
            code: 'HUM201',
            name: 'Etica profesional',
            credits: 2,
            professor: 'Ana Gomez',
            grades: completedPlan(2024, 2, { first: 4.4, second: 4.5, project: 4.6, final: 4.5 }),
          },
        ],
      },
      {
        name: 'Semestre 3',
        year: 2025,
        period: 1,
        status: SemesterStatus.Completed,
        subjects: [
          {
            code: 'EDD301',
            name: 'Estructuras de datos',
            credits: 4,
            professor: 'Sebastian Ruiz',
            grades: completedPlan(2025, 1, { first: 4.2, second: 4.0, project: 4.8, final: 4.3 }),
          },
          {
            code: 'BDD301',
            name: 'Bases de datos',
            credits: 4,
            professor: 'Paula Henao',
            grades: completedPlan(2025, 1, { first: 4.7, second: 4.4, project: 4.9, final: 4.6 }),
          },
          {
            code: 'MAT301',
            name: 'Algebra lineal',
            credits: 3,
            professor: 'Laura Restrepo',
            grades: completedPlan(2025, 1, { first: 2.9, second: 3.3, project: 3.6, final: 3.1 }),
          },
          {
            code: 'ARQ301',
            name: 'Arquitectura de computadores',
            credits: 3,
            professor: 'Julian Vargas',
            grades: completedPlan(2025, 1, { first: 3.7, second: 3.9, project: 4.1, final: 3.8 }),
          },
        ],
      },
      {
        name: 'Semestre 4',
        year: 2025,
        period: 2,
        status: SemesterStatus.InProgress,
        subjects: [
          {
            code: 'WEB401',
            name: 'Desarrollo web',
            credits: 4,
            professor: 'Paula Henao',
            grades: inProgressPlan(2025, 2, { quiz: 4.8, homework: 4.6, first: 4.5 }),
          },
          {
            code: 'ALG401',
            name: 'Analisis de algoritmos',
            credits: 4,
            professor: 'Sebastian Ruiz',
            grades: inProgressPlan(2025, 2, { quiz: 3.0, homework: 3.4, first: 2.6 }),
          },
          {
            code: 'RED401',
            name: 'Redes de computadores',
            credits: 3,
            professor: 'Julian Vargas',
            grades: inProgressPlan(2025, 2, { quiz: 3.8, homework: 4.0, first: 3.5 }),
          },
          {
            code: 'ING401',
            name: 'Ingenieria de software',
            credits: 3,
            professor: 'Diana Cardona',
            grades: inProgressPlan(2025, 2, { quiz: 4.2, homework: 4.4, first: 4.0 }),
          },
        ],
      },
    ],
  },
  {
    name: 'Samuel Martinez',
    email: 'samuel@notium.dev',
    password: 'notium123',
    role: UserRole.Student,
    semesters: [
      {
        name: 'Semestre 5',
        year: 2025,
        period: 1,
        status: SemesterStatus.Completed,
        subjects: [
          {
            code: 'IA501',
            name: 'Inteligencia artificial',
            credits: 4,
            professor: 'Sebastian Ruiz',
            grades: completedPlan(2025, 1, { first: 4.1, second: 4.3, project: 4.7, final: 4.2 }),
          },
          {
            code: 'SOP501',
            name: 'Sistemas operativos',
            credits: 3,
            professor: 'Julian Vargas',
            grades: completedPlan(2025, 1, { first: 3.5, second: 3.2, project: 3.9, final: 3.4 }),
          },
          {
            code: 'MOV501',
            name: 'Desarrollo movil',
            credits: 3,
            professor: 'Paula Henao',
            grades: completedPlan(2025, 1, { first: 4.6, second: 4.8, project: 4.9, final: 4.7 }),
          },
        ],
      },
      {
        name: 'Semestre 6',
        year: 2025,
        period: 2,
        status: SemesterStatus.InProgress,
        subjects: [
          {
            code: 'CLD601',
            name: 'Computacion en la nube',
            credits: 3,
            professor: 'Paula Henao',
            grades: inProgressPlan(2025, 2, { quiz: 4.4, homework: 4.1, first: 3.9 }),
          },
          {
            code: 'SEG601',
            name: 'Seguridad informatica',
            credits: 3,
            professor: 'Diana Cardona',
            grades: inProgressPlan(2025, 2, { quiz: 2.8, homework: 3.1, first: 2.4 }),
          },
          {
            code: 'PRY601',
            name: 'Proyecto integrador',
            credits: 4,
            professor: 'Carlos Mejia',
            grades: inProgressPlan(2025, 2, { quiz: 4.0, homework: 4.5, first: 4.3 }),
          },
        ],
      },
    ],
  },
  {
    name: 'Administrador Notium',
    email: 'admin@notium.dev',
    password: 'admin123',
    role: UserRole.Admin,
    semesters: [
      {
        name: 'Semestre de referencia',
        year: 2026,
        period: 1,
        status: SemesterStatus.Planned,
        subjects: [
          {
            code: 'ADM001',
            name: 'Plantilla de materia',
            credits: 3,
            professor: 'Sin asignar',
            grades: [],
          },
        ],
      },
    ],
  },
]
