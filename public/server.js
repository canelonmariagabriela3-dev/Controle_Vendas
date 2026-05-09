require('dotenv').config({ path: '../.env' }); // O .env costuma ficar na raiz, fora da src
const express = require('express');
const db = require('./Config/index'); // Importa a conexão do MySQL
const clienteRoutes = require('./routes/clienteRoutes'); // Importa as rotas do cliente
const historicoRoutes = require('./routes/historicoRoutes'); // Importa as rotas do histórico
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

app.use('/api', clienteRoutes); // Prefixa as rotas com /api, por exemplo: /api/clientes
app.use('/api', historicoRoutes); // Prefixa as rotas com /api, por exemplo: /api/historico
// O teste de conexão que você queria
db.getConnection()
    .then(conn => {
        console.log('✅ Conexão estabelecida com sucesso!');
        conn.release();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Erro crítico ao conectar no banco:', err.message);
        process.exit(1);
    }); //http://localhost:3000/api/clientes