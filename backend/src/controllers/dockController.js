const Dock = require('../models/Dock');
const mqttClient = require('../config/mqtt');

const dockController = {
  // Get all docks
  async getAllDocks(req, res) {
    try {
      const docks = await Dock.findAll();
      res.json(docks);
    } catch (error) {
      console.error('Error fetching docks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get dock by ID
  async getDockById(req, res) {
    try {
      const { id } = req.params;
      const dock = await Dock.findById(id);
      
      if (!dock) {
        return res.status(404).json({ error: 'Dock not found' });
      }
      
      res.json(dock);
    } catch (error) {
      console.error('Error fetching dock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get dock with bikes
  async getDockWithBikes(req, res) {
    try {
      const { id } = req.params;
      const dock = await Dock.findById(id);
      
      if (!dock) {
        return res.status(404).json({ error: 'Dock not found' });
      }
      
      const bikes = await dock.getBikes();
      const availableBikes = await dock.getAvailableBikes();
      
      res.json({
        ...dock,
        bikes,
        availableBikes: availableBikes.length,
        totalBikes: bikes.length
      });
    } catch (error) {
      console.error('Error fetching dock with bikes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new dock
  async createDock(req, res) {
    try {
      const { name, location_lat, location_lng, capacity, status } = req.body;
      
      // Basic validation
      if (!name || !location_lat || !location_lng || !capacity) {
        return res.status(400).json({ 
          error: 'Name, location coordinates, and capacity are required' 
        });
      }
      
      const dock = await Dock.create({ 
        name, 
        location_lat, 
        location_lng, 
        capacity, 
        status 
      });
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/docks/${dock.id}/created`, {
        dock_id: dock.id,
        name: dock.name,
        location: { lat: dock.location_lat, lng: dock.location_lng },
        capacity: dock.capacity,
        status: dock.status,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(dock);
    } catch (error) {
      console.error('Error creating dock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update dock
  async updateDock(req, res) {
    try {
      const { id } = req.params;
      const { name, location_lat, location_lng, capacity, status } = req.body;
      
      // Basic validation
      if (!name || !location_lat || !location_lng || !capacity) {
        return res.status(400).json({ 
          error: 'Name, location coordinates, and capacity are required' 
        });
      }
      
      const dock = await Dock.update(id, { 
        name, 
        location_lat, 
        location_lng, 
        capacity, 
        status 
      });
      
      if (!dock) {
        return res.status(404).json({ error: 'Dock not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/docks/${dock.id}/status`, {
        dock_id: dock.id,
        name: dock.name,
        location: { lat: dock.location_lat, lng: dock.location_lng },
        capacity: dock.capacity,
        status: dock.status,
        timestamp: new Date().toISOString()
      });
      
      res.json(dock);
    } catch (error) {
      console.error('Error updating dock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete dock
  async deleteDock(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Dock.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Dock not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/docks/${id}/deleted`, {
        dock_id: id,
        timestamp: new Date().toISOString()
      });
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting dock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = dockController;