const express = require('express');
const router = express.Router();
const movimentacaoEstoqueController = require('../controllers/movimentacaoEstoqueController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Ações de leitura (acessíveis publicamente)
router.get('/', movimentacaoEstoqueController.getMovimentacoesEstoque); // Listar movimentações de estoque
router.get('/:id', movimentacaoEstoqueController.getMovimentacaoEstoqueById); // Obter movimentação de estoque por ID

// Ações que modificam (restritas a usuários autenticados e com permissões)
router.post('/', authMiddleware, roleMiddleware('Adminiistradir'), movimentacaoEstoqueController.createMovimentacaoEstoque); // Criar movimentação de estoque (apenas Adminiistradir)
router.put('/:id', authMiddleware, roleMiddleware('Adminiistradir'), movimentacaoEstoqueController.updateMovimentacaoEstoque); // Atualizar movimentação de estoque (apenas Adminiistradir)
router.delete('/:id', authMiddleware, roleMiddleware('Adminiistradir'), movimentacaoEstoqueController.deleteMovimentacaoEstoque); // Excluir movimentação de estoque (apenas Adminiistradir)

module.exports = router;