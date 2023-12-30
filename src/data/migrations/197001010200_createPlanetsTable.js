const {
    tables
} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.planets, (table) => {
            table.increments('id')
                .primary();
            table.string('name', 255)
                .notNullable()
                .unique();
            table.boolean('discovered')
                .notNullable()
                .defaultTo(true);
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.planets);
    },
};