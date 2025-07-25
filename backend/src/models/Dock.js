const { pool } = require('../config/database');

class Dock {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.location_lat = data.location_lat;
    this.location_lng = data.location_lng;
    this.capacity = data.capacity;
    this.status = data.status; // 'active', 'maintenance', 'offline'
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM docks ORDER BY name');
      return rows.map(row => new Dock(row));
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM docks WHERE id = ?', [id]);
      return rows.length > 0 ? new Dock(rows[0]) : null;
    } finally {
      conn.release();
    }
  }

  static async create(dockData) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        'INSERT INTO docks (name, location_lat, location_lng, capacity, status) VALUES (?, ?, ?, ?, ?)',
        [dockData.name, dockData.location_lat, dockData.location_lng, dockData.capacity, dockData.status || 'active']
      );
      return this.findById(result.insertId);
    } finally {
      conn.release();
    }
  }

  static async update(id, dockData) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE docks SET name = ?, location_lat = ?, location_lng = ?, capacity = ?, status = ?, updated_at = NOW() WHERE id = ?',
        [dockData.name, dockData.location_lat, dockData.location_lng, dockData.capacity, dockData.status, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query('DELETE FROM docks WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  async getBikes() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM bikes WHERE dock_id = ?', [this.id]);
      const Bike = require('./Bike');
      return rows.map(row => new Bike(row));
    } finally {
      conn.release();
    }
  }

  async getAvailableBikes() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        'SELECT * FROM bikes WHERE dock_id = ? AND status = ?',
        [this.id, 'available']
      );
      const Bike = require('./Bike');
      return rows.map(row => new Bike(row));
    } finally {
      conn.release();
    }
  }
}

module.exports = Dock;