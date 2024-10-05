require('dotenv').config(); // Carrega as variáveis de ambiente do .env

// Verificação das variáveis de ambiente para garantir que estão definidas
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_DATABASE_PRODUCTION || !process.env.DB_HOST) {
    throw new Error('Alguma variável de ambiente não foi definida. Verifique o arquivo .env');
}

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_DEVELOPMENT,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    },
    test: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_TEST,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_PRODUCTION,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
    },
};