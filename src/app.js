// Importar Bibliotecas
// Configurações do dotenv
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Middleware para logging de requisições
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');


// Importar Routes
const categoriaRoutes = require('./Routes/categoriaRoutes');
const produtoRoutes = require('./Routes/produtoRoutes');
const estoqueRoutes = require('./Routes/estoqueRoutes');
const movimentacaoEstoqueRoutes = require('./Routes/movimentacaoEstoqueRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');
const roleRoutes = require('./Routes/roleRoutes');
const usuarioRoleRoutes = require('./Routes/usuarioRoleRoutes');
const authRoutes = require('./Routes/authRoutes');

// Importar Middlewares
const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');

// Conectar ao banco de dados
require('./config/db');

// Inicializar o aplicativo Express
const app = express();

// Middleware para logging de requisições para ambiente de dev e produçao
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', { stream: accessLogStream }));

// Configurações do CORS
app.use(cors({
    origin: '*', // Permite que qualquer domínio acesse a API
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas Publicas - Sem autenticação
app.use('/api/auth', authRoutes); 
app.post('/api/usuarios', usuarioRoutes);

// Rotas protegidas - Adicionando o middleware de autenticação
app.use('/api/categorias', authMiddleware, categoriaRoutes);
app.use('/api/produtos', authMiddleware, produtoRoutes);
app.use('/api/estoques', authMiddleware, estoqueRoutes);
app.use('/api/movimentacoes', authMiddleware, movimentacaoEstoqueRoutes);
app.use('/api/usuarios', authMiddleware, usuarioRoutes);

// Rotas protegidas - Adicionando o middleware de autenticação
app.use('/api/roles', authMiddleware, roleMiddleware('Administrador'), roleRoutes); 
app.use('/api/usuarios-roles', authMiddleware, usuarioRoleRoutes);


// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Ocorreu um erro interno no servidor.', error: err.message });
});

// Iniciar o servidor
const port = process.env.PORT || 5432;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});