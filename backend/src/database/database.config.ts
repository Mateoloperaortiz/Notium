import type { DataSourceOptions } from 'typeorm';

/** TypeORM settings shared by the API and the migration CLI. */
export class DatabaseConfig {
  /** SQLite connection; entities and migrations are loaded from the compiled dist folder. */
  public static getOptions(): DataSourceOptions {
    return {
      type: 'better-sqlite3',
      database: process.env.SQLITE_PATH ?? 'database.sqlite',
      entities: [`${import.meta.dirname}/../**/*.entity.js`],
      migrations: [`${import.meta.dirname}/migrations/*.js`],
      synchronize: false,
    };
  }
}
