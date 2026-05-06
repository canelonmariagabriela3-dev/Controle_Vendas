const express = require('express');
const router = express.Router();
const HistoricoController = require('../Controllers/historicoController');

router.post('/historico/venda', HistoricoController.registrarVenda);
router.post('/historico/pagamento', HistoricoController.registrarPagamento);


module.exports = router;