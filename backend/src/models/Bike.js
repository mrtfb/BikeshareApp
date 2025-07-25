const { pool } = require('../config/database');

class Bike {
  constructor(data) {
    this.id = data.id;
    this.dock_id = data.dock_id;
    this.battery_level = data.battery_level;
    this.status = data.status; // 'available', 'rented', 'maintenance', 'charging'
    this.charging_status = data.charging_status; // 'not_charging', 'charging', 'fully_charged'
    this.last_maintenance = data.last_maintenance;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM bikes ORDER BY dock_id, id');
      return rows.map(row => new Bike(row));
    } finally {
      conn.release();
    }
  }

  static async findById(id) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM bikes WHERE id = ?', [id]);
      return rows.length > 0 ? new Bike(rows[0]) : null;
    } finally {
      conn.release();
    }
  }

  static async findByDock(dockId) {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM bikes WHERE dock_id = ?', [dockId]);
      return rows.map(row => new Bike(row));
    } finally {
      conn.release();
    }
  }

  static async create(bikeData) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        'INSERT INTO bikes (dock_id, battery_level, status, charging_status) VALUES (?, ?, ?, ?)',
        [bikeData.dock_id, bikeData.battery_level || 100, bikeData.status || 'available', bikeData.charging_status || 'not_charging']
      );
      return this.findById(result.insertId);
    } finally {
      conn.release();
    }
  }

  static async update(id, bikeData) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE bikes SET dock_id = ?, battery_level = ?, status = ?, charging_status = ?, updated_at = NOW() WHERE id = ?',
        [bikeData.dock_id, bikeData.battery_level, bikeData.status, bikeData.charging_status, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async updateStatus(id, status) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE bikes SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async updateBatteryLevel(id, batteryLevel) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE bikes SET battery_level = ?, updated_at = NOW() WHERE id = ?',
        [batteryLevel, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async updateChargingStatus(id, chargingStatus) {
    const conn = await pool.getConnection();
    try {
      await conn.query(
        'UPDATE bikes SET charging_status = ?, updated_at = NOW() WHERE id = ?',
        [chargingStatus, id]
      );
      return this.findById(id);
    } finally {
      conn.release();
    }
  }

  static async delete(id) {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query('DELETE FROM bikes WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  }

  async getDock() {
    if (!this.dock_id) return null;
    
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query('SELECT * FROM docks WHERE id = ?', [this.dock_id]);
      if (rows.length > 0) {
        const Dock = require('./Dock');
        return new Dock(rows[0]);
      }
      return null;
    } finally {
      conn.release();
    }
  }
}

module.exports = Bike;