const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Importar os validadores
const estoqueValidation = require('../validations/estoqueValidation');

// Ações de leitura (acessíveis publicamente)
router.get('/', estoqueController.getEstoques); // Acessar todos os estoques
router.get('/:id', estoqueController.getEstoqueById); // Acessar um estoque por ID

// Rota de criação, atualização e exclusão de estoque
router.post('/', authMiddleware, roleMiddleware('Administrador'), estoqueValidation, estoqueController.createEstoque);

router.put('/:id', authMiddleware, roleMiddleware('Administrador'), estoqueValidation, estoqueController.updateEstoque);

router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), estoqueController.deleteEstoque);

module.exports = router;