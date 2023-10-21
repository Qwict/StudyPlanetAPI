module.exports = {
    seed: async (knex) => {
        await knex('planets').insert([{
            id: 1,
            name: 'Earth',
            image: 2131165272,
        }, {
            id: 2,
            name: 'Mars',
            image: 2131165277,
        }, {
            id: 3,
            name: 'Europa',
            image: 2131165273,
        }, {
            id: 4,
            name: 'Titan',
            image: 2131165277,
        }, {
            id: 5,
            name: 'Venus',
            image: 2131165277,
        }, {
            id: 6,
            name: 'Mercury',
            image: 2131165277,
        }, {
            id: 7,
            name: 'Pluto',
            image: 2131165277,
        }]);
    },
};