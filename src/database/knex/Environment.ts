import { Knex } from 'knex';
import path from 'path';

export const development: Knex.Config = {
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'cosmic-db',
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
