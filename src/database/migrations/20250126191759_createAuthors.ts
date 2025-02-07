import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.authors);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.authors, (table) => {
      table.increments('id').unsigned().primary();
      table.string('name', 80).notNullable();
      table.date('birth_date').notNullable();
      table.date('death_date');
      table.text('bio');
      table.string('ol_author_key', 15);
      table.boolean('is_deleted').notNullable().defaultTo(false);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.authors);
}
