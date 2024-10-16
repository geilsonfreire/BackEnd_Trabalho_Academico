const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const produtoValidation = require('../validations/produtoValidation');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Ações de leitura (acessíveis publicamente)
router.get('/', produtoController.getProdutos); // Listar todos os produtos
router.get('/:id', produtoController.getProdutoById); // Obter produto por ID

// Ações que modificam (restritas a usuários autenticados e com permissões)
router.post('/', authMiddleware, roleMiddleware('Administrador'), produtoValidation, produtoController.createProduto); // Criar produto (apenas Administrador)
router.put('/:id', authMiddleware, roleMiddleware('Administrador'), produtoValidation, produtoController.updateProduto); // Atualizar produto (apenas Administrador)
router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), produtoController.deleteProduto); // Excluir produto (apenas admin)

module.exports = router;
