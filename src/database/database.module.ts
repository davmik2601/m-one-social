import { Logger, Module } from '@nestjs/common';
import { Pool } from 'pg';

import { PG_POOL } from '@Database/database.constants';
import { pgConfigOptions } from '@Database/database-config-options';

@Module({
  providers: [
    {
      provide: PG_POOL,
      useFactory: async () => {
        const logger = new Logger(DatabaseModule.name);
        const pool = new Pool({
          ...pgConfigOptions,
          max: 20, // maximum number of clients in the pool
        });

        /** try to connect to the Postgres database */
        try {
          const client = await pool.connect();
          await client.query('SELECT 1'); // optional: basic health check
          client.release();
          logger.log('Postgres connected successfully.');
        } catch (err) {
          logger.error('Postgres connection failed.');
          throw err;
        }

        return pool;
      },
    },
  ],
  exports: [PG_POOL],
})
export class DatabaseModule {}
