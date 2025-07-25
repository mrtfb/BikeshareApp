const { pool } = require('../config/database');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.phone = data.phone;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM users ORDER BY created_at DESC');
      return rows.map(row => new User(row));
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows.length > 0 ? new User(rows[0]) : null;
    } finally {
      conn.release();
    }
  }

  static async findByEmail(email) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM users WHERE email = ?', [email]);
      return rows.length > 0 ? new User(rows[0]) : null;
    } finally {
      conn.release();
    }
  }

  static async create(userData) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        'INSERT INTO users (email, name, phone) VALUES (?, ?, ?)',
        [userData.email, userData.name, userData.phone]
      );
      return this.findById(result.insertId);
    } finally {
      conn.release();
    }
  }

  static async update(id, userData) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE users SET email = ?, name = ?, phone = ?, updated_at = NOW() WHERE id = ?',
        [userData.email, userData.name, userData.phone, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }
}

module.exports = User;