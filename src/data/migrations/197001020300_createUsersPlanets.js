const {
    tables
} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.usersPlanets, (table) => {
            table.increments('id')
                .primary();
            table.boolean('explored')
                .defaultTo(false)
                .notNullable();
            table.integer('user_id')
                .unsigned()
                .notNullable();
            table.integer('planet_id')
                .unsigned()
                .notNullable();
            table.foreign('user_id', 'fk_user_id_planet')
                .references(`${tables.users}.id`)
                .onDelete('CASCADE');
            table.foreign('planet_id', 'fk_planet_user_id')
                .references(`${tables.planets}.id`)
                .onDelete('CASCADE');
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.usersPlanets);
    },
};