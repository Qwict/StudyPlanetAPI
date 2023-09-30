module.exports = {
    port: 9000,
    log: {
        level: 'silly',
        disabled: false,
    },
    cors: {
        origins: ['http://localhost:3000'],
        maxAge: 3 * 60 * 60, // 3h in seconds
    },
    database: {
        client: 'mysql2',
        port: 3306,
        name: 'todo_test',
    },
};