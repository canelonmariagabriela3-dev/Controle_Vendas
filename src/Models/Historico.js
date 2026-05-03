const db = require('../db');

const Historico = {
  registro: async (id_cliente, tipo, valor) => {
    const sql = `
      INSERT INTO historico 
      (id_cliente, tipo, valor) 
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [id_cliente, tipo, valor]);

    return result.insertId;
  },
};

module.exports = Historico;