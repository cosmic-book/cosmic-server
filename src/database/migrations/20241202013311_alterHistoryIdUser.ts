import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.histories, (table) => {
    table.integer('id_user').unsigned().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.histories, (table) => {
    table.dropColumn('id_user');
  });
}
