import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table.renameColumn('like', 'favorite');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table.renameColumn('favorite', 'like');
  });
}
