import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table.renameColumn('ownership', 'category');

    table.date('start_date').nullable();
    table.date('finish_date').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable(TableNames.readings, (table) => {
    table.renameColumn('category', 'ownership');

    table.dropColumn('start_date');
    table.dropColumn('finish_date');
  });
}
