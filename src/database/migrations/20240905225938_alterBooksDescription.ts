import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.books, (table) => {
    table.text('description').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.books, (table) => {
    table.string('description', 350).notNullable().alter();
  });
}
