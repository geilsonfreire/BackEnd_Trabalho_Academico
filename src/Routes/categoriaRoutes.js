const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { createCategoriaValidator, updateCategoriaValidator } = require('../validations/categoriaValidation'); 
const authMiddleware = require('../middleware/authMiddleware'); // Middleware de autenticação
const roleMiddleware = require('../middleware/roleMiddleware'); // Middleware de autorização


// Rota para obter todas as categorias
router.get('/', categoriaController.getCategorias);

// Rota para obter uma categoria específica pelo ID
router.get('/:id', categoriaController.getCategoriaById);

// Rota para criar uma nova categoria
router.post('/', authMiddleware, roleMiddleware('Administrador'), createCategoriaValidator, categoriaController.createCategoria);

// Rota para atualizar uma categoria existente pelo ID
router.put('/:id', authMiddleware, roleMiddleware('Administrador'), updateCategoriaValidator, categoriaController.updateCategoria);

// Rota para deletar uma categoria pelo ID
router.delete('/:id', authMiddleware, roleMiddleware('Administrador'), categoriaController.deleteCategoria);

module.exports = router;