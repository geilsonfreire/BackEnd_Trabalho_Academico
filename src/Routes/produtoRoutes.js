const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const produtoValidation = require('../validations/produtoValidation');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Rotas de leitura (acessíveis publicamente)
router.get('/', produtoController.getProdutos); 
router.get('/:id', produtoController.getProdutoById); 

// Ações que modificam (restritas a usuários autenticados e com permissões)
router.post('/', authMiddleware, produtoValidation, produtoController.createProduto);

router.put('/:id', authMiddleware, produtoValidation, produtoController.updateProduto); 

router.delete('/:id', authMiddleware, produtoController.deleteProduto); 

module.exports = router;
