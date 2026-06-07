app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', clienteRoutes); // Prefixa as rotas com /api, por exemplo: /api/clientes
app.use('/api', historicoRoutes); // Prefixa as rotas com /api, por exemplo: /api/historico

// ROTA CORINGA: Garante que o Render entregue o index.html na tela do celular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});
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