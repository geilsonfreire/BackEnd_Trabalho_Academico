const { body } = require('express-validator');

const produtoValidation = [
    body('nome').isString().notEmpty().withMessage('O nome do produto é obrigatório.'),
    body('descricao').optional().isString().withMessage('A descrição deve ser uma string.'),
    body('preco_compra').isFloat({ gt: 0 }).withMessage('O preço de compra deve ser um número positivo.'),
    body('preco_venda').isFloat({ gt: 0 }).withMessage('O preço de venda deve ser um número positivo.'),
    body('unidade_de_medida').isString().notEmpty().withMessage('A unidade de medida é obrigatória.'),
    body('quantidade_minima').optional().isInt({ gt: 0 }).withMessage('A quantidade mínima deve ser um número inteiro positivo.'),
    body('quantidade_atual').optional().isInt({ gt: 0 }).withMessage('A quantidade atual deve ser um número inteiro positivo.'),
    body('tipo_movimentacao').optional().isString().withMessage('O tipo de movimentação deve ser uma string.'),
    body('data_movimentacao').optional().isISO8601().toDate().withMessage('A data de movimentação deve ser uma data válida.'),
    body('id_categoria').optional().isInt().withMessage('O ID da categoria deve ser um número inteiro.')
];

module.exports = produtoValidation;