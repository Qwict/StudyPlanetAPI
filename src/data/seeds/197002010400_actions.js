module.exports = {
    seed: async (knex) => {
        await knex('actions').insert([{
            id: 1,
            user_id: '1',
        }]);
    },
};