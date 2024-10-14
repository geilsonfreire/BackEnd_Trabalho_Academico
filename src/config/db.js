const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificação das variáveis de ambiente
if (!process.env.DB_DATABASE || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST || !process.env.JWT_SECRET) {
    throw new Error('Alguma variável de ambiente não foi definida. Verifique o arquivo .env');
}

// Configurações do Sequelize
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    define: {
        timestamps: true,
        underscored: true,
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};

// Instância do Sequelize
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    dbConfig
);


// Testar a conexão
sequelize.authenticate()
    .then(() => {
        console.log('Conexão com o banco de dados realizada com sucesso.');
    })
    .catch(err => {
        console.error('Não foi possível conectar ao banco de dados:', err);
    });

// Exporta a instância do Sequelize e a chave secreta
module.exports = {
    jwt_secret: process.env.JWT_SECRET  
};

module.exports = sequelize