const { body } = require('express-validator');
const { Estoque, Produto } = require('../models'); // Importar os modelos para validação

const movimentacaoEstoqueValidation = [
    body('tipo_movimentacao')
        .isIn(['Entrada', 'Saida']).withMessage('O tipo deve ser "Entrada" ou "Saída".'),
    body('quantidade')
        .isInt({ gt: 0 }).withMessage('A quantidade deve ser um número inteiro maior que 0.'),
    body('data_movimentacao')
        .isISO8601().withMessage('A data deve estar no formato ISO 8601.'),
    body('id_estoque')
        .notEmpty().withMessage('O ID do estoque é obrigatório.')
        .isInt().withMessage('O ID do estoque deve ser um número inteiro.')
        .custom(async (value) => {
            const estoqueExists = await Estoque.findByPk(value);
            if (!estoqueExists) {
                throw new Error('Estoque não encontrado.');
            }
        }),
    body('id_produto')
        .notEmpty().withMessage('O ID do produto é obrigatório.')
        .isInt().withMessage('O ID do produto deve ser um número inteiro.')
        .custom(async (value) => {
            const produtoExists = await Produto.findByPk(value);
            if (!produtoExists) {
                throw new Error('Produto não encontrado.');
            }
        })
];

module.exports = movimentacaoEstoqueValidation;