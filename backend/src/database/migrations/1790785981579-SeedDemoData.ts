import { hash } from 'bcrypt';
import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Demo data the frontend seeders used to load: 3 users, 4 semesters, 6 subjects and 10 grades. */
export class SeedDemoData1790785981579 implements MigrationInterface {
  public name = 'SeedDemoData1790785981579';

  /** Inserts the demo data; passwords are stored as bcrypt hashes, never as plain text. */
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users = [
      {
        id: 1,
        name: 'Mateo',
        email: 'mateo@example.com',
        password: 'mateo-password',
        role: 'user',
        timestamp: '2026-01-01 08:00:00',
      },
      {
        id: 2,
        name: 'Lucía',
        email: 'lucia@example.com',
        password: 'lucia-password',
        role: 'user',
        timestamp: '2026-01-02 08:00:00',
      },
      {
        id: 3,
        name: 'Administrador',
        email: 'admin@example.com',
        password: 'admin-password',
        role: 'admin',
        timestamp: '2026-01-03 08:00:00',
      },
    ];

    for (const user of users) {
      await queryRunner.query(
        'INSERT INTO "user" ("id", "name", "email", "password", "role", "createdAt", "updatedAt") VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          user.id,
          user.name,
          user.email,
          await hash(user.password, 10),
          user.role,
          user.timestamp,
          user.timestamp,
        ],
      );
    }

    await queryRunner.query(`
      INSERT INTO "semester" ("id", "userId", "name", "year", "period", "status", "createdAt", "updatedAt") VALUES
      (1, 1, '2026-1', 2026, 1, 'En proceso', '2026-01-19 08:00:00', '2026-01-19 08:00:00'),
      (2, 1, '2026-2', 2026, 2, 'Entrante', '2026-07-27 08:00:00', '2026-07-27 08:00:00'),
      (3, 2, '2026-1', 2026, 1, 'En proceso', '2026-01-19 09:00:00', '2026-01-19 09:00:00'),
      (4, 2, '2026-2', 2026, 2, 'Entrante', '2026-07-27 09:00:00', '2026-07-27 09:00:00')
    `);
    await queryRunner.query(`
      INSERT INTO "subject" ("id", "semesterId", "code", "name", "credits", "professor", "createdAt", "updatedAt") VALUES
      (1, 1, 'ISAW-01', 'Ingeniería de Software para Aplicaciones Web', 3, 'Daniel Correa', '2026-01-19 08:30:00', '2026-01-19 08:30:00'),
      (2, 1, 'DAW-01', 'Desarrollo de Aplicaciones Web', 3, 'Laura Gómez', '2026-01-19 08:30:00', '2026-01-19 08:30:00'),
      (3, 2, 'FAA-01', 'Fundamentos de Aprendizaje Automático', 3, 'Andrés Rojas', '2026-07-27 08:30:00', '2026-07-27 08:30:00'),
      (4, 3, 'BD-01', 'Bases de Datos', 3, 'Carolina Pérez', '2026-01-19 09:30:00', '2026-01-19 09:30:00'),
      (5, 3, 'AS-01', 'Arquitectura de Software', 3, 'Felipe Vargas', '2026-01-19 09:30:00', '2026-01-19 09:30:00'),
      (6, 4, 'SEG-01', 'Seguridad de Aplicaciones Web', 3, 'Natalia Ruiz', '2026-07-27 09:30:00', '2026-07-27 09:30:00')
    `);
    await queryRunner.query(`
      INSERT INTO "grade" ("id", "subjectId", "title", "value", "percentage", "type", "date", "createdAt", "updatedAt") VALUES
      (1, 1, 'Primer parcial', 4.2, 30, 'Parcial', '2026-03-10', '2026-03-10 08:00:00', '2026-03-10 08:00:00'),
      (2, 1, 'Proyecto', 4.5, 35, 'Proyecto', '2026-04-20', '2026-04-20 08:00:00', '2026-04-20 08:00:00'),
      (3, 2, 'Taller de Vue', 4.7, 25, 'Taller', '2026-03-24', '2026-03-24 08:00:00', '2026-03-24 08:00:00'),
      (4, 2, 'Primer parcial', 4.1, 30, 'Parcial', '2026-04-01', '2026-04-01 08:00:00', '2026-04-01 08:00:00'),
      (5, 3, 'Laboratorio inicial', 4.4, 20, 'Laboratorio', '2026-08-18', '2026-08-18 08:00:00', '2026-08-18 08:00:00'),
      (6, 4, 'Modelo entidad-relación', 4.6, 25, 'Taller', '2026-03-12', '2026-03-12 09:00:00', '2026-03-12 09:00:00'),
      (7, 4, 'Segundo parcial', 4.3, 30, 'Parcial', '2026-04-22', '2026-04-22 09:00:00', '2026-04-22 09:00:00'),
      (8, 5, 'Diseño arquitectónico', 4.8, 35, 'Proyecto', '2026-04-05', '2026-04-05 09:00:00', '2026-04-05 09:00:00'),
      (9, 5, 'Presentación final', 4.5, 30, 'Presentación', '2026-05-10', '2026-05-10 09:00:00', '2026-05-10 09:00:00'),
      (10, 6, 'Auditoría de seguridad', 4.7, 40, 'Proyecto', '2026-09-15', '2026-09-15 09:00:00', '2026-09-15 09:00:00')
    `);
  }

  /** Deletes the demo users; the foreign keys delete their semesters, subjects and grades. */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM "user" WHERE "id" IN (1, 2, 3)');
  }
}
