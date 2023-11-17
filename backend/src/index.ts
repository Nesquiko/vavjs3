import { Pool } from 'pg';
import { initDb } from './app/db';
import { serverStart } from './app/endpoints';
import dotenv from 'dotenv';

const ENV_FILE = '.env.local';
dotenv.config({ path: ENV_FILE });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: false,
});
initDb(pool);

serverStart(pool, 8080);
