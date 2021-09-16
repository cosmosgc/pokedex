import * as Knex from 'knex';

// yarn knex migrate:make <migration_name> -x ts
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary()
    table.string('name').notNullable().unique()
    table.string('email').unique()
    table.string('password').notNullable()
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}

