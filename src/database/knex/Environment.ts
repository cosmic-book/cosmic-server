import { Knex } from 'knex';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

export const development: Knex.Config = {
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    host: process.env.DB_HOST || '',
    port: Number(process.env.DB_PORT) || 0,
    user: process.env.DB_USER || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '',
    charset: 'utf8'
  },
  migrations: {
    directory: path.resolve(__dirname, '..', 'migrations')
  }
};

export const staging: Knex.Config = {
  ...development
};

export const production: Knex.Config = {
  ...development
};
