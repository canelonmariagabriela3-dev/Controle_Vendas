const Cliente = require('../Models/Cliente');

const ClienteController = {
    criar: async (req, res) => {
        try {
            const { nome, telefone, local_trabalho } = req.body;

            const id = await Cliente.criar(nome, telefone, local_trabalho);
            res.status(201).json({ id, message: 'Cliente criado com sucesso!' });
        }
        catch (err) {
            console.error('Erro ao criar cliente:', err);
            res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    },
    listar: async (req, res) => {
        try {
            const cliente = await Cliente.listar();
            res.status(200).json(cliente);
        }
        catch (err) {
            console.error('Erro ao listar clientes:', err);
            res.status(500).json({ error: 'Erro ao listar clientes' });
        }
    },
    buscarPorId: async (req, res) => {
        try {
            const { id } = req.params;
            const cliente = await Cliente.buscarPorId(id);
            if (!cliente) {
                return res.status(404).json({ error: 'Cliente não encontrado' });
            }
            res.status(200).json(cliente);
        } catch (err) {
            console.error('Erro ao buscar cliente:', err);
            res.status(500).json({ error: 'Erro ao buscar cliente' });
        }
    }
};



module.exports = ClienteController;
