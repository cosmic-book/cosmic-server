import { knex } from 'knex';
import { development, staging, production } from './Environment';

const getEnvironment = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;
    case 'staging':
      return staging;

    default:
      return development;
  }
};

export const Knex = knex(getEnvironment());
