// Import bibliotecas 
const bcrypt = require('bcrypt');
const { Usuario, UsuarioRole, Role } = require('../models');
const { validationResult } = require('express-validator');
const usuarioValidation = require('../validations/usuarioValidation');

// Função para criptografar a senha
const hashSenha = async (senha) => {
    const saltRounds = 10;
    return await bcrypt.hash(senha, saltRounds);
};

exports.createUsuario = [
    usuarioValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Criptografar a senha antes de salvar
            const senhaCriptografada = await hashSenha(req.body.senha);

            // Criar o usuário com a senha criptografada
            const usuario = await Usuario.create({
                ...req.body,
                senha: senhaCriptografada
            });

            // Criar a associação na tabela UsuarioRole, se o id_role estiver presente
            if (req.body.id_role) {
                await UsuarioRole.create({
                    id_usuario: usuario.id_usuario,
                    id_role: req.body.id_role
                });
            }

            res.status(201).json(usuario);
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            res.status(500).json({ error: 'Erro ao criar usuário.', message: error.message });
        }
    }
];

// Função para obter todos os usuários com seus papéis (roles)
exports.getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: [{
                model: Role,
                as: 'roles',
                attributes: ['nome']
            }]
        });

        const usuariosComRoles = usuarios.map(usuario => ({
            id: usuario.id_usuario,
            nome: usuario.nome,
            email: usuario.email,
            status: usuario.status,
            roles: usuario.roles.map(role => role.nome)
        }));

        res.status(200).json(usuariosComRoles);
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        res.status(500).json({ error: 'Erro ao obter usuários.', message: error.message });
    }
};

// Função para obter um usuário pelo ID
exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id, {
            include: [{
                model: Role,
                as: 'roles',
                attributes: ['nome']
            }]
        });

        if (usuario) {
            const usuarioComRoles = {
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                status: usuario.status,
                roles: usuario.roles.map(role => role.nome)
            };

            res.status(200).json(usuarioComRoles);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({ error: 'Erro ao obter usuário.', message: error.message });
    }
};

// Função para atualizar um usuário
exports.updateUsuario = [
    usuarioValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // Encontrar o usuário
            const usuario = await Usuario.findByPk(req.params.id);
            if (!usuario) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Se a senha estiver presente na requisição, criptografar antes de atualizar
            if (req.body.senha) {
                req.body.senha = await hashSenha(req.body.senha);
            }

            // Atualizar os dados do usuário
            await usuario.update(req.body);

            // Atualizar os papéis do usuário
            if (req.body.roles) {
                // Remover todos os papéis atuais do usuário
                await UsuarioRole.destroy({ where: { id_usuario: usuario.id_usuario } });

                // Adicionar os novos papéis
                const rolesToAdd = req.body.roles.map(roleId => ({
                    id_usuario: usuario.id_usuario,
                    id_role: roleId
                }));

                if (rolesToAdd.length > 0) {
                    await UsuarioRole.bulkCreate(rolesToAdd);
                }
            }

            // Buscar e retornar o usuário atualizado
            const updatedUser = await Usuario.findByPk(req.params.id, {
                include: [{
                    model: Role,
                    as: 'roles',
                    attributes: ['nome']
                }]
            });

            const usuarioComRoles = {
                id: updatedUser.id_usuario,
                nome: updatedUser.nome,
                email: updatedUser.email,
                status: updatedUser.status,
                roles: updatedUser.roles.map(role => role.nome)
            };

            res.status(200).json(usuarioComRoles);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário.', message: error.message });
        }
    }
];

// Função para deletar um usuário
exports.deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await usuario.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ error: 'Erro ao deletar usuário.', message: error.message });
    }
};