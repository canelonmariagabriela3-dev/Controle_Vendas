// Cliente.js
// criar cliente,buscar cliente, atualizar
const db = require('../index');

const Cliente = {
    criar: async (nome, telefone, local_trabalho) => {
        const [result] = await db.query(
            'INSERT INTO clientes (nome, telefone, local_Trabalho) VALUES (?, ?, ?)',
            [nome, telefone, local_trabalho]
        );
        return result.insertId; 
    },
    listar: async () => {
        const [rows] = await db.query('SELECT * FROM clientes');
        return rows;
    },
    buscarPorId: async (id) => {
        const [rows] = await db.query('SELECT * FROM clientes WHERE id = ?', [id]);
        return rows[0];
    },
    atualizarSaldo: async (id_Cliente, valor) => {
        const [result] = await db.query(
            'UPDATE clientes SET saldo_fiado = saldo_fiado + ? WHERE id = ?',
            [valor, id_Cliente]
        );
        return result.affectedRows > 0;
    },
    adicionarPontos: async (id_Cliente, pontos) => {
        const [result] = await db.query(
            'UPDATE clientes SET pontos_fidelidade = pontos_fidelidade + ? WHERE id = ?',
            [pontos, id_Cliente]
        );
        return result.affectedRows > 0;

    }
};

module.exports = Cliente; 