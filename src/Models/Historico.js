const Historico = require('../models/Historico');
const Cliente = require('../models/Cliente');

const HistoricoController = {

  registrarVenda: async (req, res) => {
    try {
      // 1. pegar dados
      const { id_cliente, valor } = req.body;

      // validação simples
      if (!id_cliente || !valor) {
        return res.status(400).json({ error: 'id_cliente e valor são obrigatórios' });
      }

      // 2. calcular pontos
      const pontos = Math.floor(valor / 10);

      // 3. registrar no histórico
      await Historico.registro(id_cliente, 'venda_fiado', valor);

      // 4. atualizar saldo
      await Cliente.atualizarSaldo(id_cliente, valor);

      // 5. atualizar pontos
      await Cliente.adicionarPontos(id_cliente, pontos);

      // 6. resposta
      res.status(201).json({
        message: 'Venda registrada com sucesso!',
        pontos_ganhos: pontos
      });

    } catch (err) {
      console.error('Erro ao registrar venda:', err);
      res.status(500).json({ error: 'Erro ao registrar venda' });
    }
  }

};

module.exports = HistoricoController;