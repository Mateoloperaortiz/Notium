import Grade from '@/models/Grade';
import Semester from '@/models/Semester';
import Subject from '@/models/Subject';
import User from '@/models/User';

const softwareEngineeringGrades: Grade[] = [
  new Grade('grade-1', 'Primer parcial', 4.2, 30),
  new Grade('grade-2', 'Proyecto', 4.5, 35),
];

const webDevelopmentGrades: Grade[] = [
  new Grade('grade-3', 'Taller de Vue', 4.7, 25),
  new Grade('grade-4', 'Primer parcial', 4.1, 30),
];

const machineLearningGrades: Grade[] = [new Grade('grade-5', 'Laboratorio inicial', 4.4, 20)];

export const mockGrades: Grade[] = [
  ...softwareEngineeringGrades,
  ...webDevelopmentGrades,
  ...machineLearningGrades,
];

const softwareEngineering = new Subject(
  'subject-1',
  'Ingeniería de Software para Aplicaciones Web',
  3,
  softwareEngineeringGrades,
);

const webDevelopment = new Subject(
  'subject-2',
  'Desarrollo de Aplicaciones Web',
  3,
  webDevelopmentGrades,
);

const machineLearning = new Subject(
  'subject-3',
  'Fundamentos de Aprendizaje Automático',
  3,
  machineLearningGrades,
);

export const mockSubjects: Subject[] = [softwareEngineering, webDevelopment, machineLearning];

export const mockSemesters: Semester[] = [
  new Semester('semester-1', '2026-1', '2026-01-19', '2026-05-30', [
    softwareEngineering,
    webDevelopment,
  ]),
  new Semester('semester-2', '2026-2', '2026-07-27', '2026-11-28', [machineLearning]),
];

export const mockUsers: User[] = [new User('user-1', 'Mateo', 'mateo@example.com', mockSemesters)];
