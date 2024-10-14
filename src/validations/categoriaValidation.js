const { body, param } = require('express-validator');

// Validação para criação de categorias
exports.createCategoriaValidator = [
    body('nome')
        .isString().withMessage('Nome deve ser uma string.')
        .notEmpty().withMessage('Nome é obrigatório.')
        .isLength({ max: 50 }).withMessage('Nome deve ter no máximo 50 caracteres.')
];

// Validação para atualização de categorias
exports.updateCategoriaValidator = [
    param('id')
        .isInt().withMessage('ID deve ser um número inteiro.')
        .notEmpty().withMessage('ID é obrigatório.'),
    body('nome')
        .optional() // Torna o nome opcional durante a atualização
        .isString().withMessage('Nome deve ser uma string.')
        .isLength({ max: 50 }).withMessage('Nome deve ter no máximo 50 caracteres.')
];