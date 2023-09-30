module.exports = {
    seed: async (knex) => {
        await knex('users').insert([{
            id: 1,
            name: 'JorisVanDuyse',
            auth0id: 'google-oauth2|110281891841572483344',
            email: 'jorisduyse@gmail.com',
        }, {
            id: 2,
            name: 'JorisVanDuyseHogent',
            auth0id: 'auth0|6393342e3906880086e7d5e0',
            email: 'joris.vanduyse@student.hogent.be',
        }]);
    },
};