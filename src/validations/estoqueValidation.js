const { body } = require('express-validator');
const { Produto } = require('../models');

const estoqueValidation = [
    body('id_produto')
        .notEmpty().withMessage('O ID do produto é obrigatório.')
        .isInt().withMessage('O ID do produto deve ser um número inteiro.')
        .custom(async (value) => {
            const produtoExists = await Produto.findByPk(value);
            if (!produtoExists) {
                throw new Error('Produto não encontrado.');
            }
        }),
    body('quantidade_minima')
        .notEmpty().withMessage('A quantidade mínima é obrigatória.')
        .isInt({ gt: 0 }).withMessage('A quantidade mínima deve ser um número inteiro maior que 0.'),
    body('quantidade_atual')
        .notEmpty().withMessage('A quantidade atual é obrigatória.')
        .isInt({ gt: 0 }).withMessage('A quantidade atual deve ser um número inteiro maior que 0.'),
];

module.exports = estoqueValidation;