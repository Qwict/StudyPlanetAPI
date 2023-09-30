module.exports = {
    seed: async (knex) => {
        await knex('users_planets').delete();
        await knex('planets').delete();
        await knex('users').delete();
    },
}