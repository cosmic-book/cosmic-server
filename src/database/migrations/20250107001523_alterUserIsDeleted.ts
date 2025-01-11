import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.users, (table) => {
    table.boolean('is_deleted').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.users, (table) => {
    table.dropColumn('is_deleted');
  });
}
