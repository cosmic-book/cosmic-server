import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table
      .integer('status')
      .notNullable()
      .defaultTo(0)
      .comment('0 as To Read | 1 as Reading | 2 as Finished | 3 as Rereading | 4 as Abandoned')
      .alter();

    table.integer('type').notNullable().defaultTo(0).comment('0 as Printed | 1 as Digital | 2 as Audio').alter();

    table.integer('category').notNullable().defaultTo(0).comment('0 as Book | 1 as Comic | 2 as Magazine').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table.integer('status').notNullable().defaultTo(0).comment('').alter();
    table.integer('type').notNullable().defaultTo(0).comment('').alter();
    table.integer('category').notNullable().defaultTo(0).comment('').alter();
  });
}
