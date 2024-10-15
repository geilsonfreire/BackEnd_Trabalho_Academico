// src/logger.js

const winston = require('winston');

// Criar um logger
const logger = winston.createLogger({
    level: 'info', // Nível de log (info, error, warn, etc.)
    format: winston.format.combine(
        winston.format.timestamp(), // Adiciona timestamp
        winston.format.json() // Formato JSON para fácil leitura
    ),
    transports: [
        // Configuração para log no console
        new winston.transports.Console({
            format: winston.format.simple(), // Formato simples no console
        }),
        // Configuração para log no Loggly
        new winston.transports.Http({
            host: 'logs-01.loggly.com', // URL do Loggly
            path: '/inputs/YOUR_LOGGLY_TOKEN/tag/http/', // Substitua YOUR_LOGGLY_TOKEN pelo seu token
            ssl: true,
            level: 'info' // Nível de log enviado para Loggly
        })
    ],
});

// Exportar o logger
module.exports = logger;