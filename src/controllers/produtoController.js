const { Produto, Categoria, Estoque, MovimentacaoEstoque } = require('../models');
const { validationResult } = require('express-validator');

// Função auxiliar para validar a existência de um registro
const validateExistence = async (model, id) => {
    const item = await model.findByPk(id);
    if (!item) {
        throw new Error(`${model.name} não encontrado.`);
    }
};

// Verifica se há erros de validação
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
};

// Criar um novo produto com dados relacionados
exports.createProduto = async (req, res) => {
    handleValidationErrors(req, res);

    const {
        nome, descricao, preco_compra, preco_venda,
        unidade_de_medida, quantidade_minima,
        quantidade_atual, tipo_movimentacao,
        id_categoria, data_movimentacao
    } = req.body;

    try {
        // Validar associações
        await Promise.all([
            id_categoria && validateExistence(Categoria, id_categoria)
        ]);

        // Criar o produto
        const novoProduto = await Produto.create({
            nome,
            descricao,
            preco_compra,
            preco_venda,
            unidade_de_medida,
            id_categoria
        });

        // Criar o registro no estoque
        await Estoque.create({
            id_produto: novoProduto.id_produto,
            quantidade_minima,
            quantidade_atual,
        });

        // Criar a movimentação de estoque
        await MovimentacaoEstoque.create({
            id_produto: novoProduto.id_produto,
            tipo_movimentacao,
            data_movimentacao: data_movimentacao || new Date(),
            quantidade: quantidade_atual
        });

        const produtoCriado = await Produto.findByPk(novoProduto.id_produto, {
            include: [
                { model: Categoria, as: 'categoria', attributes: ['nome'] },
                { model: Estoque, as: 'estoque', attributes: ['quantidade_minima', 'quantidade_atual'] },
                { model: MovimentacaoEstoque, as: 'movimentacoes', attributes: ['tipo_movimentacao', 'quantidade', 'data_movimentacao'] }
            ]
        });

        return res.status(201).json(produtoCriado);
    } catch (error) {
        console.error("Erro ao criar produto e dados relacionados", error);
        return res.status(500).json({ message: "Erro ao criar produto e dados relacionados", error: error.message });
    }
};

// Obter todos os produtos com filtros e dados relacionados
exports.getProdutos = async (req, res) => {
    try {
        const { categoria, status, data } = req.query;
        const filters = {};

        // Filtro por categoria
        if (categoria) {
            filters['$categoria.nome$'] = categoria;
        }

        // Filtro por status (movimentação)
        if (status) {
            filters['$movimentacoes.tipo_movimentacao$'] = status;
        }

        // Filtro por data
        if (data) {
            filters['$movimentacoes.data_movimentacao$'] = data;
        }

        const produtos = await Produto.findAll({
            attributes: [
                'id_produto',
                'nome',
                'descricao',
                'preco_compra',
                'preco_venda',
                'unidade_de_medida',
                'updated_at'
            ],
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nome']
                },
                {
                    model: Estoque,
                    as: 'estoque',
                    attributes: ['quantidade_minima', 'quantidade_atual']
                },
                {
                    model: MovimentacaoEstoque,
                    as: 'movimentacoes',
                    attributes: ['tipo_movimentacao', 'quantidade', 'data_movimentacao']
                }
            ],
            where: filters
        });

        res.status(200).json(produtos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produtos.', message: error.message });
    }
};

// Obter um produto por ID com dados relacionados
exports.getProdutoById = async (req, res) => {
    try {
        const produto = await Produto.findByPk(req.params.id, {
            attributes: [
                'id_produto',
                'nome',
                'descricao',
                'preco_compra',
                'preco_venda',
                'unidade_de_medida',
                'updated_at'
            ],
            include: [
                {
                    model: Categoria,
                    as: 'categoria',
                    attributes: ['nome']
                },
                {
                    model: Estoque,
                    as: 'estoque',
                    attributes: ['quantidade_minima', 'quantidade_atual']
                },
                {
                    model: MovimentacaoEstoque,
                    as: 'movimentacoes',
                    attributes: ['tipo_movimentacao', 'quantidade', 'data_movimentacao']
                }
            ]
        });

        if (produto) {
            res.status(200).json(produto);
        } else {
            res.status(404).json({ error: 'Produto não encontrado.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar produto.', message: error.message });
    }
};

// Atualizar um produto existente
exports.updateProduto = async (req, res) => {
    const { id } = req.params;
    handleValidationErrors(req, res);

    const {
        nome, descricao, preco_compra, preco_venda,
        unidade_de_medida, quantidade_minima,
        quantidade_atual, data_movimentacao, tipo_movimentacao,
        id_categoria
    } = req.body;

    try {
        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        // Validar associações
        await Promise.all([
            id_categoria && validateExistence(Categoria, id_categoria)
        ]);

        await produto.update({
            nome,
            descricao,
            preco_compra,
            preco_venda,
            unidade_de_medida,
            id_categoria
        });

        // Atualizar o registro no estoque
        const estoque = await Estoque.findOne({ where: { id_produto: id } });
        if (estoque) {
            await estoque.update({
                quantidade_minima,
                quantidade_atual
            });
        } else {
            await Estoque.create({
                id_produto: id,
                quantidade_minima,
                quantidade_atual
            });
        }

        // Atualizar a movimentação de estoque
        const movimentacao = await MovimentacaoEstoque.findOne({ where: { id_produto: id } });
        if (movimentacao) {
            await movimentacao.update({
                tipo_movimentacao,
                data_movimentacao: data_movimentacao || new Date(),
                quantidade: quantidade_atual
            });
        } else {
            await MovimentacaoEstoque.create({
                id_produto: id,
                tipo_movimentacao,
                data_movimentacao: data_movimentacao || new Date(),
                quantidade: quantidade_atual
            });
        }

        const produtoAtualizado = await Produto.findByPk(id, {
            include: [
                { model: Categoria, as: 'categoria', attributes: ['nome'] },
                { model: Estoque, as: 'estoque', attributes: ['quantidade_minima', 'quantidade_atual'] },
                { model: MovimentacaoEstoque, as: 'movimentacoes', attributes: ['tipo_movimentacao', 'quantidade', 'data_movimentacao'] }
            ]
        });

        return res.status(200).json(produtoAtualizado);
    } catch (error) {
        console.error("Erro ao atualizar produto", error);
        return res.status(500).json({ message: "Erro ao atualizar produto", error: error.message });
    }
};

// Deletar um produto
exports.deleteProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produto = await Produto.findByPk(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        await produto.destroy();

        return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao deletar produto.', message: error.message });
    }
};
