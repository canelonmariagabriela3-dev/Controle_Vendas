//mapa para as variaveis de ambiente do banco de dados 
require('dotenv').config(); // Garante que o Node leia o .env

module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Controle_Vendas',
   
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
};