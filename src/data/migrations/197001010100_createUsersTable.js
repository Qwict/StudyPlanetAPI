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
            table.string('email', 255)
                .notNullable()
                .unique();
            table.uuid('uuid')
                .notNullable()
                .unique();
            table.string('salt', 255)
                .notNullable()
                .unique();
            table.string('hash', 255)
                .notNullable()
                .unique();
            table.integer('experience')
                .defaultTo(0);
            table.uuid('validation_id')
                .nullable();
            table.bigint('selected_time')
                .nullable();
            table.timestamp('start_time')
                .nullable();
            table.timestamp('end_time')
                .nullable();
            table.boolean('discovering')
                .defaultTo(false);
            table.boolean('exploring')
                .defaultTo(false);
        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.users);
    },
};