const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'MiSalud',
    password: 'Gugusano147*',
    port: 5432, // Default PostgreSQL port
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Error connecting to PostgreSQL:', err));

module.exports = pool;
