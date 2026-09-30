import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Creates the user, semester, subject and grade tables with cascading foreign keys. */
export class InitialSchema1790785956489 implements MigrationInterface {
  public name = 'InitialSchema1790785956489';

  /** Creates the tables. */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "name" varchar NOT NULL,
                "email" varchar NOT NULL,
                "password" varchar NOT NULL,
                "role" varchar NOT NULL DEFAULT ('user'),
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "semester" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "name" varchar NOT NULL,
                "year" integer NOT NULL,
                "period" integer NOT NULL,
                "status" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "subject" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "semesterId" integer NOT NULL,
                "code" varchar NOT NULL,
                "name" varchar NOT NULL,
                "credits" integer NOT NULL,
                "professor" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "subjectId" integer NOT NULL,
                "title" varchar NOT NULL,
                "value" real NOT NULL,
                "percentage" integer NOT NULL,
                "type" varchar NOT NULL,
                "date" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_semester" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "name" varchar NOT NULL,
                "year" integer NOT NULL,
                "period" integer NOT NULL,
                "status" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_3dfecd5c6ba9119565f44a83526" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_semester"(
                    "id",
                    "userId",
                    "name",
                    "year",
                    "period",
                    "status",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "userId",
                "name",
                "year",
                "period",
                "status",
                "createdAt",
                "updatedAt"
            FROM "semester"
        `);
    await queryRunner.query(`
            DROP TABLE "semester"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_semester"
                RENAME TO "semester"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_subject" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "semesterId" integer NOT NULL,
                "code" varchar NOT NULL,
                "name" varchar NOT NULL,
                "credits" integer NOT NULL,
                "professor" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_042db48bce3793aad4725bdaf7f" FOREIGN KEY ("semesterId") REFERENCES "semester" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_subject"(
                    "id",
                    "semesterId",
                    "code",
                    "name",
                    "credits",
                    "professor",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "semesterId",
                "code",
                "name",
                "credits",
                "professor",
                "createdAt",
                "updatedAt"
            FROM "subject"
        `);
    await queryRunner.query(`
            DROP TABLE "subject"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_subject"
                RENAME TO "subject"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "subjectId" integer NOT NULL,
                "title" varchar NOT NULL,
                "value" real NOT NULL,
                "percentage" integer NOT NULL,
                "type" varchar NOT NULL,
                "date" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_47ee890e96d2e8bab85b056f39a" FOREIGN KEY ("subjectId") REFERENCES "subject" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_grade"(
                    "id",
                    "subjectId",
                    "title",
                    "value",
                    "percentage",
                    "type",
                    "date",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "subjectId",
                "title",
                "value",
                "percentage",
                "type",
                "date",
                "createdAt",
                "updatedAt"
            FROM "grade"
        `);
    await queryRunner.query(`
            DROP TABLE "grade"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_grade"
                RENAME TO "grade"
        `);
  }

  /** Drops the tables in reverse order. */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "grade"
                RENAME TO "temporary_grade"
        `);
    await queryRunner.query(`
            CREATE TABLE "grade" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "subjectId" integer NOT NULL,
                "title" varchar NOT NULL,
                "value" real NOT NULL,
                "percentage" integer NOT NULL,
                "type" varchar NOT NULL,
                "date" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            INSERT INTO "grade"(
                    "id",
                    "subjectId",
                    "title",
                    "value",
                    "percentage",
                    "type",
                    "date",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "subjectId",
                "title",
                "value",
                "percentage",
                "type",
                "date",
                "createdAt",
                "updatedAt"
            FROM "temporary_grade"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_grade"
        `);
    await queryRunner.query(`
            ALTER TABLE "subject"
                RENAME TO "temporary_subject"
        `);
    await queryRunner.query(`
            CREATE TABLE "subject" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "semesterId" integer NOT NULL,
                "code" varchar NOT NULL,
                "name" varchar NOT NULL,
                "credits" integer NOT NULL,
                "professor" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            INSERT INTO "subject"(
                    "id",
                    "semesterId",
                    "code",
                    "name",
                    "credits",
                    "professor",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "semesterId",
                "code",
                "name",
                "credits",
                "professor",
                "createdAt",
                "updatedAt"
            FROM "temporary_subject"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_subject"
        `);
    await queryRunner.query(`
            ALTER TABLE "semester"
                RENAME TO "temporary_semester"
        `);
    await queryRunner.query(`
            CREATE TABLE "semester" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer NOT NULL,
                "name" varchar NOT NULL,
                "year" integer NOT NULL,
                "period" integer NOT NULL,
                "status" varchar NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);
    await queryRunner.query(`
            INSERT INTO "semester"(
                    "id",
                    "userId",
                    "name",
                    "year",
                    "period",
                    "status",
                    "createdAt",
                    "updatedAt"
                )
            SELECT "id",
                "userId",
                "name",
                "year",
                "period",
                "status",
                "createdAt",
                "updatedAt"
            FROM "temporary_semester"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_semester"
        `);
    await queryRunner.query(`
            DROP TABLE "grade"
        `);
    await queryRunner.query(`
            DROP TABLE "subject"
        `);
    await queryRunner.query(`
            DROP TABLE "semester"
        `);
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
