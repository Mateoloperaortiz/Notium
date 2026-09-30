import { DatabaseConfig } from './database.config.js';
import { DataSource } from 'typeorm';

/** DataSource the TypeORM CLI uses to generate, run and revert migrations. */
export default new DataSource(DatabaseConfig.getOptions());
