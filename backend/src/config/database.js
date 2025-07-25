const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'cornelias.pt',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  acquireTimeout: 60000,
  timeout: 60000,
  connectionLimit: 5
});

// Test connection
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Connected to MariaDB!');
    return true;
  } catch (err) {
    console.error('Error connecting to MariaDB:', err.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

module.exports = { pool, testConnection };