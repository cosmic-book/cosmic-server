import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.histories);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.histories, (table) => {
      table.increments('id').unsigned().primary();
      table.integer('id_reading').unsigned().notNullable();
      table.date('date').notNullable();
      table.integer('read_pages').notNullable().defaultTo(0);
      table.string('comment', 120);
      table
        .foreign('id_reading', 'fk_histories_idReading')
        .references('id')
        .inTable(TableNames.readings)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.histories);
}
