const express = require('express');
const router = express.Router();
const movimentacaoEstoqueController = require('../controllers/movimentacaoEstoqueController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Ações de leitura (acessíveis publicamente)
router.get('/', movimentacaoEstoqueController.getMovimentacoesEstoque); 

router.get('/:id', movimentacaoEstoqueController.getMovimentacaoEstoqueById); 

// Rotas que modificam (restritas a usuários autenticados e com permissões)
router.post('/', authMiddleware, movimentacaoEstoqueController.createMovimentacaoEstoque); 

router.put('/:id', authMiddleware, movimentacaoEstoqueController.updateMovimentacaoEstoque); 

router.delete('/:id', authMiddleware, movimentacaoEstoqueController.deleteMovimentacaoEstoque); 

module.exports = router;