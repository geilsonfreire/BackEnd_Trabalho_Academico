const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Ações de leitura (acessíveis publicamente)   
router.get('/', roleController.getRoles); 
router.get('/:id', roleController.getRoleById); 

// Aplicando autenticação para todas as rotas e controle de acesso para criação, atualização e exclusão
router.post('/', authMiddleware, roleMiddleware('Administrador'), roleController.createRole);
router.put('/:id', authMiddleware, roleMiddleware('Administrador'), roleController.updateRole);
router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), roleController.deleteRole);

module.exports = router;
