//mapa para as variaveis de ambiente do banco de dados 
require('dotenv').config(); // Garante que o Node leia o .env

let config;

// Se o Render enviar a URL cheia do banco, nós usamos ela
if (process.env.DATABASE_URL) {
    config = {
        uri: process.env.DATABASE_URL,
        // Isso resolve erros de conexão segura exigidos pela nuvem
        ssl: { rejectUnauthorized: false } 
    };
} else {
    // Se não tiver a URL (no seu computador local), usa a sua configuração padrão
    config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'Controle_Vendas'
    };
}

// Mantém os seus limites de conexões idênticos
config.connectionLimit = 10;
config.waitForConnections = true;
config.queueLimit = 0;

module.exports = config;