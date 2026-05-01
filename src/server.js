require('dotenv').config({ path: '../.env' }); // O .env costuma ficar na raiz, fora da src
const express = require('express');
const db = require('./index'); // Importa a conexão do MySQL

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// O teste de conexão que você queria
db.getConnection()
    .then(conn => {
        console.log('✅ Conexão estabelecida com sucesso!');
        conn.release();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro crítico ao conectar no banco:', err.message);
        process.exit(1);
    });