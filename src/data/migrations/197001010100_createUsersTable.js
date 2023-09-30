const {
    tables
} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.users, (table) => {
            table.increments('id')
                .primary();
            table.string('name', 255)
                .defaultTo('anon');
            table.string('auth0id', 255)
                .notNullable()
                .unique();
            table.string('email', 255)
                .notNullable()
                .unique();
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.users);
    },
};