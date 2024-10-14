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

// Ações que modificam (restritas a usuários autenticados e com permissões)
router.post('/', authMiddleware, roleMiddleware('Administrador'), estoqueValidation, estoqueController.createEstoque); // Criar novo estoque (apenas Administrador)
router.put('/:id', authMiddleware, roleMiddleware('Administrador'), estoqueValidation, estoqueController.updateEstoque); // Atualizar estoque (apenas Administrador)
router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), estoqueController.deleteEstoque); // Excluir estoque (apenas admin)

module.exports = router;