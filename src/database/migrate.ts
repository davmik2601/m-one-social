/** * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This file-script is for running database migrations.
 * first create a table called _migrations if it does not exist,
 * then read all .sql files from the migrations directory,
 * and execute them in order.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Pool } from 'pg';

import { pgConfigOptions } from './database-config-options';

const pool = new Pool(pgConfigOptions);

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    /** create migrations table if it does not exist */

    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        "filename" TEXT UNIQUE NOT NULL,
        "runAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    /** read all migration files from the migrations directory */

    const migrationDir = join(__dirname, 'migrations');
    const files = readdirSync(migrationDir)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      /** check if the migration has already been run */

      const alreadyRun = await client.query(
        `SELECT 1 FROM _migrations WHERE filename = $1`,
        [file],
      );

      /** if not, run the migration and insert it into the _migrations table */

      if (alreadyRun.rowCount === 0) {
        const sql = readFileSync(join(migrationDir, file), 'utf8');
        console.info(`Running migration: ${file}`);
        await client.query(sql);
        await client.query(`INSERT INTO _migrations(filename) VALUES ($1)`, [
          file,
        ]);
      } else {
        console.info(`Skipping already run migration: ${file}`);
      }
    }

    await client.query('COMMIT');
    console.info('All migrations applied.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => console.error(err));
