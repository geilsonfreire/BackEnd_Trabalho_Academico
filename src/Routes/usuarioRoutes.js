const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const authMiddleware = require('../middleware/authMiddleware'); 
const { 
    createUsuario, 
    getUsuarios, 
    getUsuarioById, 
    updateUsuario, 
    deleteUsuario 
} = require('../controllers/usuarioController');

// Rota protegida para gerenciar um novo usuário
router.post('/', authMiddleware, roleMiddleware('Administrador'), createUsuario);
router.put('/:id', authMiddleware, roleMiddleware('Administrador'), updateUsuario); 
router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), deleteUsuario);

// Rotas de leitura (acessíveis publicamente)
router.get('/', authMiddleware, getUsuarios);
router.get('/:id', authMiddleware, getUsuarioById); 

module.exports = router;