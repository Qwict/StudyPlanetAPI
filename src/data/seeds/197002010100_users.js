module.exports = {
    seed: async (knex) => {
        await knex('users').insert([{
            id: 1,
            name: 'qwertic',
            email: 'qwertic@qwict.com',
            salt: '9E0GXD66M8RELO3TmF5u4fwH00m6d/lgr/uwtOAn2ZZOH2GkCcCTGAqOBX/lBbQyURzzXX62su3mDv/AIVq2HH6x2anecMeV74TAgTeugqG3vclg06ihthA0JpRX+TSxTbNqeHiSrEzQjRdi3ffExXO3Ctt7xZm6dMy8BinXBZo=',
            hash: 'YKFJWMM9fJRy3+3ki/rOGfO1dFTIfOoRNZ1KHow3jSpGoUcPXwIuOmcootFFp8k4Xpgy4gxR/9sn2+l8ejFZNQ==',
        },]);
    },
};