const { body } = require('express-validator');

const usuarioValidation = [
    body('nome').if(body('nome').exists()).notEmpty().withMessage('O nome do usuário é obrigatório.'),
    body('email').if(body('email').exists()).isEmail().withMessage('O e-mail deve ser válido.'),
    body('senha').if(body('senha').exists()).isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.')
];

module.exports = usuarioValidation;