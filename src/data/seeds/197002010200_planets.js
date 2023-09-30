module.exports = {
    seed: async (knex) => {
        await knex('planets').insert([{
            id: 1,
            name: 'Earth',
            time_to_explore: 0.5,
            time_to_discover: 0.25,
        }, {
            id: 2,
            name: 'Mars',
            time_to_explore: 1.5,
            time_to_discover: 1.0,
        }, {
            id: 3,
            name: 'Europa',
            time_to_explore: 2.5,
            time_to_discover: 2.0,
        }]);
    },
};