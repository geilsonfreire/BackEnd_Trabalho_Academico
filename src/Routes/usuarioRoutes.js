const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware');
const { 
    createUsuario, 
    getUsuarios, 
    getUsuarioById, 
    updateUsuario, 
    deleteUsuario 
} = require('../controllers/usuarioController');

// Rota protegida para gerenciar um novo usuário
router.post('/', roleMiddleware('Administrador'), createUsuario);
router.put('/:id', roleMiddleware('Administrador'), updateUsuario); 
router.delete('/:id', roleMiddleware('Administrador'), deleteUsuario);

// Rotas publicas
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById); 

module.exports = router;