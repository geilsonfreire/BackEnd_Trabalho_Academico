const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { createCategoriaValidator, updateCategoriaValidator } = require('../Validations/categoriaValidation'); 
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticação

// Rota para criar uma nova categoria
router.post('/', authMiddleware, createCategoriaValidator, categoriaController.createCategoria);

// Rota para obter todas as categorias
router.get('/', categoriaController.getCategorias);

// Rota para obter uma categoria específica pelo ID
router.get('/:id', categoriaController.getCategoriaById);

// Rota para atualizar uma categoria existente pelo ID
router.put('/:id', authMiddleware, updateCategoriaValidator, categoriaController.updateCategoria);

// Rota para deletar uma categoria pelo ID
router.delete('/:id', authMiddleware, categoriaController.deleteCategoria);

module.exports = router;