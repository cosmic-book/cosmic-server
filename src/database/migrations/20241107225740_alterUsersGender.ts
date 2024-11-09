import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.users, (table) => {
    table
      .integer('gender')
      .notNullable()
      .defaultTo(0)
      .comment('0 as Not Informed | 1 as Masculine | 2 as Feminine | 3 as Other')
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.users, (table) => {
    table.string('gender', 1).notNullable().comment('').alter();
  });
}
