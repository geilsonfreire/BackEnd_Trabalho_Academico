const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const { roles } = req.user || {}; // Garante que req.user existe

        // Verifica se as roles do usuário estão definidas
        if (!roles || !Array.isArray(roles)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
        }

        // Verifica se o usuário possui a role necessária
        if (!roles.includes(requiredRole)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
        }

        next(); // Continua para a próxima função de middleware ou rota
    };
};

module.exports = roleMiddleware;
