import type { SubjectInterface } from '#shared/interfaces/SubjectInterface.js';

export const subjects: SubjectInterface[] = [
  {
    id: 1,
    semesterId: 1,
    code: 'ISAW-01',
    name: 'Ingeniería de Software para Aplicaciones Web',
    credits: 3,
    professor: 'Daniel Correa',
    createdAt: '2026-01-19T08:30:00.000Z',
    updatedAt: '2026-01-19T08:30:00.000Z',
  },
  {
    id: 2,
    semesterId: 1,
    code: 'DAW-01',
    name: 'Desarrollo de Aplicaciones Web',
    credits: 3,
    professor: 'Laura Gómez',
    createdAt: '2026-01-19T08:30:00.000Z',
    updatedAt: '2026-01-19T08:30:00.000Z',
  },
  {
    id: 3,
    semesterId: 2,
    code: 'FAA-01',
    name: 'Fundamentos de Aprendizaje Automático',
    credits: 3,
    professor: 'Andrés Rojas',
    createdAt: '2026-07-27T08:30:00.000Z',
    updatedAt: '2026-07-27T08:30:00.000Z',
  },
];
