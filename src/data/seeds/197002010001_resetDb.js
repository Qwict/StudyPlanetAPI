module.exports = {
    seed: async (knex) => {
        await knex('actions').delete();
        await knex('users_planets').delete();
        await knex('planets').delete();
        await knex('users').delete();
    },
}