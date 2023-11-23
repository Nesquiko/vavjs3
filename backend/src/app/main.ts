import { Pool } from 'pg';
import { initDb } from './db';
import { serverStart } from './endpoints';
import express from 'express';

export function startServer(
  port: number,
  middleware: express.RequestHandler[],
) {
  console.log('Starting server at port ' + port);

  let poolConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false,
  };

  console.log(
    'Connecting to database at ' + poolConfig.host + ':' + poolConfig.port,
  );

  const pool = new Pool(poolConfig);
  initDb(pool);

  let server = serverStart(pool, port, middleware);

  return async function () {
    console.log('Stopping server');
    server.close(() => console.log('Server stopped'));
    await pool.end();
  };
}
