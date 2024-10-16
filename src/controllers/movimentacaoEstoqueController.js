const { MovimentacaoEstoque } = require('../models');
const { validationResult } = require('express-validator');
const movimentacaoEstoqueValidation = require('../validations/movimentacaoEstoqueValidation');

exports.createMovimentacaoEstoque = [
    movimentacaoEstoqueValidation,
    async (req, res) => {
        console.log('Requisição para criar movimentação de estoque:', req.body);
        console.log('Usuário:', req.user); // Log do usuário autenticado
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Criar a movimentação de estoque
            const movimentacao = await MovimentacaoEstoque.create(req.body);
            res.status(201).json(movimentacao);
        } catch (error) {
            console.error('Erro ao criar movimentação de estoque:', error);
            res.status(500).json({ error: 'Erro ao criar movimentação de estoque.', message: error.message });
        }
    }
];

exports.getMovimentacoesEstoque = async (req, res) => {
    try {
        const movimentacoes = await MovimentacaoEstoque.findAll();
        res.status(200).json(movimentacoes);
    } catch (error) {
        console.error('Erro ao buscar movimentações de estoque:', error);
        res.status(500).json({ error: 'Erro ao buscar movimentações de estoque.', message: error.message });
    }
};

exports.getMovimentacaoEstoqueById = async (req, res) => {
    try {
        const movimentacao = await MovimentacaoEstoque.findByPk(req.params.id);
        if (movimentacao) {
            res.status(200).json(movimentacao);
        } else {
            res.status(404).json({ error: 'Movimentação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao buscar movimentação de estoque:', error);
        res.status(500).json({ error: 'Erro ao buscar movimentação de estoque.', message: error.message });
    }
};

exports.updateMovimentacaoEstoque = [
    movimentacaoEstoqueValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const movimentacao = await MovimentacaoEstoque.findByPk(req.params.id);
            if (movimentacao) {
                await movimentacao.update(req.body);
                res.status(200).json(movimentacao);
            } else {
                res.status(404).json({ error: 'Movimentação não encontrada' });
            }
        } catch (error) {
            console.error('Erro ao atualizar movimentação de estoque:', error);
            res.status(500).json({ error: 'Erro ao atualizar movimentação de estoque.', message: error.message });
        }
    }
];

exports.deleteMovimentacaoEstoque = async (req, res) => {
    try {
        const movimentacao = await MovimentacaoEstoque.findByPk(req.params.id);
        if (movimentacao) {
            await movimentacao.destroy();
            res.status(204).send(); // Enviar uma resposta sem conteúdo
        } else {
            res.status(404).json({ error: 'Movimentação não encontrada' });
        }
    } catch (error) {
        console.error('Erro ao deletar movimentação de estoque:', error);
        res.status(500).json({ error: 'Erro ao deletar movimentação de estoque.', message: error.message });
    }
};