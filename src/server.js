require('dotenv').config();
const express = require('express');
const path = require('path');
const db = require('./Config/index');
const clienteRoutes = require('./routes/clienteRoutes');
const historicoRoutes = require('./routes/historicoRoutes');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', clienteRoutes);
app.use('/api', historicoRoutes);

// Rota para SPA: serve index.html para rotas não reconhecidas
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Teste de conexão com o banco de dados
db.getConnection()
    .then(conn => {
        console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
        conn.release();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando com sucesso na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro crítico ao conectar no banco:', err.message);
        process.exit(1);
    });