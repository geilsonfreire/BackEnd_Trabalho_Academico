const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const authMiddleware = async (req, res, next) => {
    // Obtendo o token do cabeçalho de autorização
    const token = req.headers.authorization?.split(' ')[1];

    // Verifica se o token foi fornecido
    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Busca o usuário no banco de dados
        const user = await Usuario.findByPk(decoded.id_usuario);

        // Verifica se o usuário existe
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        // Adiciona o usuário e seus papéis ao req para uso em rotas protegidas
        req.user = user;
        req.user.roles = decoded.roles || []; // Adiciona os papéis decodificados
        next(); // Chama o próximo middleware
    } catch (error) {
        console.error('Erro ao verificar token:', error); // Log de erro
        res.status(401).json({ message: 'Token inválido.' });
    }
};

module.exports = authMiddleware;