module.exports = {
    seed: async (knex) => {
        await knex('planets').insert([{
            id: 1,
            name: 'Earth',
        }, {
            id: 2,
            name: 'Mars',
        }, {
            id: 3,
            name: 'Europa',
        }, {
            id: 4,
            name: 'Titan',
        }, {
            id: 5,
            name: 'Venus',
        }, {
            id: 6,
            name: 'Mercury',
        }, {
            id: 7,
            name: 'Pluto',
        }]);
    },
};