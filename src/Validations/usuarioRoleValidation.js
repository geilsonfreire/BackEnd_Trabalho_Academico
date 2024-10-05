const { body } = require('express-validator');

const usuarioRoleValidation = [
    body('id_usuario')
        .exists().withMessage('O ID do usuário é obrigatório.')
        .notEmpty().withMessage('O ID do usuário não pode estar vazio.')
        .isInt().withMessage('O ID do usuário deve ser um número inteiro.'),
    body('id_role')
        .exists().withMessage('O ID da role é obrigatório.')
        .notEmpty().withMessage('O ID da role não pode estar vazio.')
        .isInt().withMessage('O ID da role deve ser um número inteiro.'),
];

module.exports = usuarioRoleValidation;
