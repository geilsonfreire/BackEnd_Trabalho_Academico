module.exports = {
    env: {
        browser: true,
        node: true,  // Isso garante que as variáveis globais do Node.js como process e __dirname sejam reconhecidas
        es2021: true,
    },
    globals: {
        __dirname: "readonly",  // Define __dirname como uma variável global de leitura
        process: "readonly",    // Define process como uma variável global de leitura
        Sequelize: "readonly",  // Define Sequelize como uma variável global de leitura
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["react"],
    rules: {
        "react/react-in-jsx-scope": "off",  // Desabilita o erro de react-in-jsx-scope
        "no-unused-vars": "warn",  // Alerta sobre variáveis não usadas
    },
    settings: {
        react: {
            version: "detect",
        },
    },
};