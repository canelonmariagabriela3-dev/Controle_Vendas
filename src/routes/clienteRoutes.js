const express = require('express');
const clienteController = require('../Controllers/clienteController');
const router = express.Router();

router.get('/clientes', clienteController.listar); 

router.post('/clientes', clienteController.criar); 

router.get('/clientes/:id', clienteController.buscarPorId);

module.exports = router;