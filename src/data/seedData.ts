import type { GradeInterface } from '@/interfaces/GradeInterface.js';
import { type SemesterInterface, StatusSemester } from '@/interfaces/SemesterInterface.js';
import type { SubjectInterface } from '@/interfaces/SubjectInterface.js';
import { Role, type UserInterface } from '@/interfaces/UserInterface.js';

const mateo: UserInterface = {
  id: 'user-1',
  name: 'Mateo',
  email: 'mateo@example.com',
  password: 'mateo-password',
  role: Role.User,
  createdAt: Date.parse('2026-01-01T08:00:00Z'),
  updatedAt: Date.parse('2026-01-01T08:00:00Z'),
  semesters: [],
};

const lucia: UserInterface = {
  id: 'user-2',
  name: 'Lucía',
  email: 'lucia@example.com',
  password: 'lucia-password',
  role: Role.User,
  createdAt: Date.parse('2026-01-02T08:00:00Z'),
  updatedAt: Date.parse('2026-01-02T08:00:00Z'),
  semesters: [],
};

const admin: UserInterface = {
  id: 'user-3',
  name: 'Administrador',
  email: 'admin@example.com',
  password: 'admin-password',
  role: Role.Admin,
  createdAt: Date.parse('2026-01-03T08:00:00Z'),
  updatedAt: Date.parse('2026-01-03T08:00:00Z'),
  semesters: [],
};

const semesterOne: SemesterInterface = {
  id: 'semester-1',
  name: '2026-1',
  year: 2026,
  period: 1,
  status: StatusSemester.inProgress,
  createdAt: Date.parse('2026-01-19T08:00:00Z'),
  updatedAt: Date.parse('2026-01-19T08:00:00Z'),
  user: mateo,
  subjects: [],
};

const semesterTwo: SemesterInterface = {
  id: 'semester-2',
  name: '2026-2',
  year: 2026,
  period: 2,
  status: StatusSemester.inComing,
  createdAt: Date.parse('2026-07-27T08:00:00Z'),
  updatedAt: Date.parse('2026-07-27T08:00:00Z'),
  user: mateo,
  subjects: [],
};

const semesterThree: SemesterInterface = {
  id: 'semester-3',
  name: '2026-1',
  year: 2026,
  period: 1,
  status: StatusSemester.inProgress,
  createdAt: Date.parse('2026-01-19T09:00:00Z'),
  updatedAt: Date.parse('2026-01-19T09:00:00Z'),
  user: lucia,
  subjects: [],
};

const semesterFour: SemesterInterface = {
  id: 'semester-4',
  name: '2026-2',
  year: 2026,
  period: 2,
  status: StatusSemester.inComing,
  createdAt: Date.parse('2026-07-27T09:00:00Z'),
  updatedAt: Date.parse('2026-07-27T09:00:00Z'),
  user: lucia,
  subjects: [],
};

const softwareEngineering: SubjectInterface = {
  id: 'subject-1',
  code: 'ISAW-01',
  name: 'Ingeniería de Software para Aplicaciones Web',
  credits: 3,
  professor: 'Daniel Correa',
  createdAt: Date.parse('2026-01-19T08:30:00Z'),
  updatedAt: Date.parse('2026-01-19T08:30:00Z'),
  semester: semesterOne,
  grades: [],
};

const webDevelopment: SubjectInterface = {
  id: 'subject-2',
  code: 'DAW-01',
  name: 'Desarrollo de Aplicaciones Web',
  credits: 3,
  professor: 'Laura Gómez',
  createdAt: Date.parse('2026-01-19T08:30:00Z'),
  updatedAt: Date.parse('2026-01-19T08:30:00Z'),
  semester: semesterOne,
  grades: [],
};

const machineLearning: SubjectInterface = {
  id: 'subject-3',
  code: 'FAA-01',
  name: 'Fundamentos de Aprendizaje Automático',
  credits: 3,
  professor: 'Andrés Rojas',
  createdAt: Date.parse('2026-07-27T08:30:00Z'),
  updatedAt: Date.parse('2026-07-27T08:30:00Z'),
  semester: semesterTwo,
  grades: [],
};

const databases: SubjectInterface = {
  id: 'subject-4',
  code: 'BD-01',
  name: 'Bases de Datos',
  credits: 3,
  professor: 'Carolina Pérez',
  createdAt: Date.parse('2026-01-19T09:30:00Z'),
  updatedAt: Date.parse('2026-01-19T09:30:00Z'),
  semester: semesterThree,
  grades: [],
};

const softwareArchitecture: SubjectInterface = {
  id: 'subject-5',
  code: 'AS-01',
  name: 'Arquitectura de Software',
  credits: 3,
  professor: 'Felipe Vargas',
  createdAt: Date.parse('2026-01-19T09:30:00Z'),
  updatedAt: Date.parse('2026-01-19T09:30:00Z'),
  semester: semesterThree,
  grades: [],
};

const cybersecurity: SubjectInterface = {
  id: 'subject-6',
  code: 'SEG-01',
  name: 'Seguridad de Aplicaciones Web',
  credits: 3,
  professor: 'Natalia Ruiz',
  createdAt: Date.parse('2026-07-27T09:30:00Z'),
  updatedAt: Date.parse('2026-07-27T09:30:00Z'),
  semester: semesterFour,
  grades: [],
};

const gradeOne: GradeInterface = {
  id: 'grade-1',
  title: 'Primer parcial',
  value: 4.2,
  percentage: 30,
  type: 'Parcial',
  date: new Date('2026-03-10T08:00:00Z'),
  createdAt: Date.parse('2026-03-10T08:00:00Z'),
  updatetAt: Date.parse('2026-03-10T08:00:00Z'),
  subject: softwareEngineering,
};

const gradeTwo: GradeInterface = {
  id: 'grade-2',
  title: 'Proyecto',
  value: 4.5,
  percentage: 35,
  type: 'Proyecto',
  date: new Date('2026-04-20T08:00:00Z'),
  createdAt: Date.parse('2026-04-20T08:00:00Z'),
  updatetAt: Date.parse('2026-04-20T08:00:00Z'),
  subject: softwareEngineering,
};

const gradeThree: GradeInterface = {
  id: 'grade-3',
  title: 'Taller de Vue',
  value: 4.7,
  percentage: 25,
  type: 'Taller',
  date: new Date('2026-03-24T08:00:00Z'),
  createdAt: Date.parse('2026-03-24T08:00:00Z'),
  updatetAt: Date.parse('2026-03-24T08:00:00Z'),
  subject: webDevelopment,
};

const gradeFour: GradeInterface = {
  id: 'grade-4',
  title: 'Primer parcial',
  value: 4.1,
  percentage: 30,
  type: 'Parcial',
  date: new Date('2026-04-01T08:00:00Z'),
  createdAt: Date.parse('2026-04-01T08:00:00Z'),
  updatetAt: Date.parse('2026-04-01T08:00:00Z'),
  subject: webDevelopment,
};

const gradeFive: GradeInterface = {
  id: 'grade-5',
  title: 'Laboratorio inicial',
  value: 4.4,
  percentage: 20,
  type: 'Laboratorio',
  date: new Date('2026-08-18T08:00:00Z'),
  createdAt: Date.parse('2026-08-18T08:00:00Z'),
  updatetAt: Date.parse('2026-08-18T08:00:00Z'),
  subject: machineLearning,
};

const gradeSix: GradeInterface = {
  id: 'grade-6',
  title: 'Modelo entidad-relación',
  value: 4.6,
  percentage: 25,
  type: 'Taller',
  date: new Date('2026-03-12T09:00:00Z'),
  createdAt: Date.parse('2026-03-12T09:00:00Z'),
  updatetAt: Date.parse('2026-03-12T09:00:00Z'),
  subject: databases,
};

const gradeSeven: GradeInterface = {
  id: 'grade-7',
  title: 'Segundo parcial',
  value: 4.3,
  percentage: 30,
  type: 'Parcial',
  date: new Date('2026-04-22T09:00:00Z'),
  createdAt: Date.parse('2026-04-22T09:00:00Z'),
  updatetAt: Date.parse('2026-04-22T09:00:00Z'),
  subject: databases,
};

const gradeEight: GradeInterface = {
  id: 'grade-8',
  title: 'Diseño arquitectónico',
  value: 4.8,
  percentage: 35,
  type: 'Proyecto',
  date: new Date('2026-04-05T09:00:00Z'),
  createdAt: Date.parse('2026-04-05T09:00:00Z'),
  updatetAt: Date.parse('2026-04-05T09:00:00Z'),
  subject: softwareArchitecture,
};

const gradeNine: GradeInterface = {
  id: 'grade-9',
  title: 'Presentación final',
  value: 4.5,
  percentage: 30,
  type: 'Presentación',
  date: new Date('2026-05-10T09:00:00Z'),
  createdAt: Date.parse('2026-05-10T09:00:00Z'),
  updatetAt: Date.parse('2026-05-10T09:00:00Z'),
  subject: softwareArchitecture,
};

const gradeTen: GradeInterface = {
  id: 'grade-10',
  title: 'Auditoría de seguridad',
  value: 4.7,
  percentage: 40,
  type: 'Proyecto',
  date: new Date('2026-09-15T09:00:00Z'),
  createdAt: Date.parse('2026-09-15T09:00:00Z'),
  updatetAt: Date.parse('2026-09-15T09:00:00Z'),
  subject: cybersecurity,
};

semesterOne.subjects.push(softwareEngineering, webDevelopment);
semesterTwo.subjects.push(machineLearning);
semesterThree.subjects.push(databases, softwareArchitecture);
semesterFour.subjects.push(cybersecurity);

mateo.semesters.push(semesterOne, semesterTwo);
lucia.semesters.push(semesterThree, semesterFour);

softwareEngineering.grades.push(gradeOne, gradeTwo);
webDevelopment.grades.push(gradeThree, gradeFour);
machineLearning.grades.push(gradeFive);
databases.grades.push(gradeSix, gradeSeven);
softwareArchitecture.grades.push(gradeEight, gradeNine);
cybersecurity.grades.push(gradeTen);

export const seedGrades: GradeInterface[] = [
  gradeOne,
  gradeTwo,
  gradeThree,
  gradeFour,
  gradeFive,
  gradeSix,
  gradeSeven,
  gradeEight,
  gradeNine,
  gradeTen,
];

export const seedSubjects: SubjectInterface[] = [
  softwareEngineering,
  webDevelopment,
  machineLearning,
  databases,
  softwareArchitecture,
  cybersecurity,
];

export const seedSemesters: SemesterInterface[] = [
  semesterOne,
  semesterTwo,
  semesterThree,
  semesterFour,
];

export const seedUsers: UserInterface[] = [mateo, lucia, admin];
