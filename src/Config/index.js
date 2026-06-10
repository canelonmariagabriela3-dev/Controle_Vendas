require('dotenv').config();
const { Pool } = require('pg'); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Exigido pelo Render para conexões seguras com o Postgres
  }
});

// Mantemos o mesmo nome de função (getConnection) que seu server.js já usa
module.exports = {
  getConnection: () => pool.connect()
};