import { Knex } from 'knex';
import { TableNames } from '../TableNames';

export async function up(knex: Knex): Promise<void> {
  const hasTable = await knex.schema.hasTable(TableNames.readings);

  if (!hasTable) {
    return knex.schema.createTable(TableNames.readings, (table) => {
      table.increments('id').unsigned().primary();
      table.integer('id_user').unsigned().notNullable();
      table.integer('id_edition').unsigned().notNullable();
      table.integer('status').notNullable().defaultTo(0);
      table.integer('type').notNullable().defaultTo(0);
      table.integer('category').notNullable().defaultTo(0);
      table.integer('read_pages');
      table.integer('rating');
      table.text('review');
      table.boolean('favorite').defaultTo(false);
      table.date('start_date').nullable();
      table.date('finish_date').nullable();
      table.boolean('is_deleted').notNullable().defaultTo(false);

      table.foreign('id_user', 'fk_readings_idUser').references('id').inTable(TableNames.users).onDelete('CASCADE');
      table
        .foreign('id_edition', 'fk_readings_idEdition')
        .references('id')
        .inTable(TableNames.editions)
        .onDelete('CASCADE');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TableNames.readings);
}
