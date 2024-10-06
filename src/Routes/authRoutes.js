const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Certifique-se de que este middleware esteja implementado

// Rota para login
router.post('/login', authController.login);

// Rota para verificar autenticação
router.get('/check', authMiddleware, authController.checkAuth); // Use middleware para verificar o token

// Rota para obter o usuário
router.get('/user', authMiddleware, authController.getUser); // Use middleware para proteger a rota

module.exports = router