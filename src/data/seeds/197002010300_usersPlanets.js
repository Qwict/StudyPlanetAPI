module.exports = {
    seed: async (knex) => {
        await knex('users_planets').insert([{
            id: 1,
            user_id: 1,
            planet_id: 1,
        }, {
            id: 2,
            user_id: 1,
            planet_id: 2,
        }, {
            id: 3,
            user_id: 1,
            planet_id: 3,
        },
        ]);
    },
};