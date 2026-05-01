//conexao com o MySQL
require('dotenv').config();
const mysql = require('mysql2/promise'); // Usando a versão moderna (Promise)
const dbConfig = require('./database');

// Criamos a conexão usando as configurações do arquivo acima
const connection = mysql.createPool(dbConfig);

// Teste de conexão simples (o .authenticate() do seu professor)
connection.getConnection()
    .then(() => console.log('Conexão com o MySQL OK!'))
    .catch(err => console.error('ERRO AO CONECTAR NO BANCO:', err));

module.exports = connection;