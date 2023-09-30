module.exports = {
    seed: async (knex) => {
        await knex('users_planets').insert([{
                id: 1,
                user_id: 1,
                planet_id: 1,
                explored: true,
            },
            {
                id: 2,
                user_id: 1,
                planet_id: 2,
                explored: false,
            },
            {
                id: 3,
                user_id: 1,
                planet_id: 3,
                explored: false,
            }
        ]);
    },
};