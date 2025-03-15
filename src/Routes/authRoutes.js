const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const authMiddleware = require('../middleware/authMiddleware'); 

// Rota para login
router.post('/login', authController.login);

// Rota para verificar autenticação do usuário
router.get('/check', authMiddleware, authController.checkAuth); 

// Rota para obter o usuário autenticado
router.get('/user', authMiddleware, authController.getUser); // Use middleware para proteger a rota

module.exports = router