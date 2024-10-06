const express = require('express');
const router = express.Router();
const usuarioRoleController = require('../controllers/usuarioRoleController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticação
const roleMiddleware = require('../middleware/roleMiddleware'); // Middleware de autorização

// Rota para associar um usuário a um role - apenas para Administrador
router.post('/:id_usuario/roles/:id_role', authMiddleware, roleMiddleware('Administrador'), usuarioRoleController.associateUsuarioRole);

// Rota para obter todos os roles associados a um usuário - público
router.get('/:id_usuario/roles', authMiddleware, usuarioRoleController.getRolesByUsuario);

// Rota para remover a associação entre um usuário e um role - apenas para Administrador
router.delete('/:id_usuario/roles/:id_role', authMiddleware, roleMiddleware('Administrador'), usuarioRoleController.deleteUsuarioRole);

module.exports = router;