import * as Knex from 'knex';


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('pokemon', table => {
        table.uuid('id').primary()
        table.string('pokeID').notNullable().unique()
        table.boolean('Seen').notNullable()
        table.boolean('Captured').notNullable()
        table.boolean('Favorite').notNullable()
        table.string('fk_userID').notNullable().references('id').inTable('users')
      })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('pokemon')
}

