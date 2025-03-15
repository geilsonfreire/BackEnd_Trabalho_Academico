// Importar models
const { UsuarioRole, Usuario, Role } = require('../models');
const { validationResult } = require('express-validator');
const usuarioRoleValidation = require('../validations/usuarioRoleValidation');

// Associa um usuário a um role
exports.associateUsuarioRole = [
    usuarioRoleValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id_usuario, id_role } = req.body;

            // Verificar se o usuário e o role existem
            const usuario = await Usuario.findByPk(id_usuario);
            const role = await Role.findByPk(id_role);

            if (!usuario || !role) {
                return res.status(404).json({ error: 'Usuário ou role não encontrado.' });
            }

            // Criar a associação
            const usuarioRole = await UsuarioRole.create({ id_usuario, id_role });
            res.status(201).json(usuarioRole);
        } catch (error) {
            console.error('Erro ao associar usuário e role:', error);
            res.status(500).json({ error: 'Erro ao associar usuário e role.', message: error.message });
        }
    }
];

// Retorna todos os roles associados a um usuário
exports.getRolesByUsuario = async (req, res) => {
    try {
        const roles = await UsuarioRole.findAll({
            where: { id_usuario: req.params.id_usuario },
            include: [
                {
                    model: Role, // Inclui o modelo de Role
                    attributes: ['id_role', 'nome'], // Adicione os campos que deseja retornar
                },
            ],
        });

        if (roles.length === 0) {
            return res.status(404).json({ message: 'Nenhum role encontrado para este usuário.' });
        }

        res.status(200).json(roles);
    } catch (error) {
        console.error('Erro ao obter roles do usuário:', error);
        res.status(500).json({ error: 'Erro ao obter roles do usuário.', message: error.message });
    }
};

// Retorna todos os usuários e seus roles
exports.getUsuariosRoles = async (req, res) => {
    try {
        const usuariosRoles = await UsuarioRole.findAll({
            include: [
                {
                    model: Usuario,
                    attributes: ['id_usuario', 'nome', 'email'], // Adicione os campos que deseja retornar
                },
                {
                    model: Role,
                    attributes: ['id_role', 'nome'], // Adicione os campos que deseja retornar
                },
            ],
        });

        if (usuariosRoles.length === 0) {
            return res.status(404).json({ message: 'Nenhuma associação encontrada.' });
        }

        res.status(200).json(usuariosRoles);
    } catch (error) {
        console.error('Erro ao obter associações de usuários e roles:', error);
        res.status(500).json({ error: 'Erro ao obter associações de usuários e roles.', message: error.message });
    }
};

// Remove a associação entre um usuário e um role
exports.deleteUsuarioRole = [
    usuarioRoleValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id_usuario, id_role } = req.body;

            // Verificar se a associação existe
            const usuarioRole = await UsuarioRole.findOne({
                where: { id_usuario, id_role },
            });

            if (!usuarioRole) {
                return res.status(404).json({ error: 'Relação de usuário e role não encontrada.' });
            }

            // Remover a associação
            await usuarioRole.destroy();
            res.status(204).send(); // Sem conteúdo
        } catch (error) {
            console.error('Erro ao remover associação:', error);
            res.status(500).json({ error: 'Erro ao remover associação.', message: error.message });
        }
    }
];

// Atualiza a associação entre um usuário e um role
exports.updateUsuarioRole = [
    usuarioRoleValidation,
    async (req, res) => {
        try {
            // Verificar se há erros de validação
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id_usuario, id_role, novo_id_role } = req.body;

            // Verificar se a associação atual existe
            const usuarioRole = await UsuarioRole.findOne({
                where: { id_usuario, id_role },
            });

            if (!usuarioRole) {
                return res.status(404).json({ error: 'Relação de usuário e role não encontrada.' });
            }

            // Verificar se o novo role existe
            const novoRole = await Role.findByPk(novo_id_role);
            if (!novoRole) {
                return res.status(404).json({ error: 'Novo role não encontrado.' });
            }

            // Atualizar a associação
            usuarioRole.id_role = novo_id_role;
            await usuarioRole.save();

            res.status(200).json(usuarioRole);
        } catch (error) {
            console.error('Erro ao atualizar associação:', error);
            res.status(500).json({ error: 'Erro ao atualizar associação.', message: error.message });
        }
    }
];