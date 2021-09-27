import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('inventory', table => {
        table.uuid('id').primary()
        table.string('pokeID').notNullable()
        table.string('nickname').notNullable()
        table.string('location').notNullable()
        table.string('area').notNullable()
        table.string('fk_userID').notNullable().references('id').inTable('users')
      })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('inventory')
}

