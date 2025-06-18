import * as dotenv from 'dotenv';
dotenv.config();

export const pgConfigOptions = {
  host: process.env.PG_HOST,
  port: +(process.env.PG_PORT ?? '5432'),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
};
