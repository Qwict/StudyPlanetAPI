const {
    tables
} = require('..');

module.exports = {
    up: async (knex) => {
        await knex.schema.createTable(tables.actions, (table) => {
            table.increments('id')
                .primary();
            table.integer('user_id')
                .unsigned()
                .notNullable();
            table.integer('selected_time')
                .unsigned()
                .nullable();
            table.bigInteger('start_time')
                .nullable();
            table.bigInteger('end_time')
                .nullable();
            table.boolean('discovering')
                .notNullable()
                .defaultTo(false);
            table.boolean('exploring')
                .notNullable()
                .defaultTo(false);
            table.foreign('user_id', 'fk_action_user')
                .references(`${tables.users}.id`)
                .onDelete('CASCADE');

        });
    },
    down: (knex) => {
        return knex.schema.dropTableIfExists(tables.actions);
    },
};