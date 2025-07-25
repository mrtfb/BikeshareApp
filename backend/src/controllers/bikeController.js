const Bike = require('../models/Bike');
const mqttClient = require('../config/mqtt');

const bikeController = {
  // Get all bikes
  async getAllBikes(req, res) {
    try {
      const bikes = await Bike.findAll();
      res.json(bikes);
    } catch (error) {
      console.error('Error fetching bikes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get bike by ID
  async getBikeById(req, res) {
    try {
      const { id } = req.params;
      const bike = await Bike.findById(id);
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      const dock = await bike.getDock();
      res.json({ ...bike, dock });
    } catch (error) {
      console.error('Error fetching bike:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get bikes by dock
  async getBikesByDock(req, res) {
    try {
      const { dockId } = req.params;
      const bikes = await Bike.findByDock(dockId);
      res.json(bikes);
    } catch (error) {
      console.error('Error fetching bikes by dock:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new bike
  async createBike(req, res) {
    try {
      const { dock_id, battery_level, status, charging_status } = req.body;
      
      // Basic validation
      if (!dock_id) {
        return res.status(400).json({ error: 'Dock ID is required' });
      }
      
      const bike = await Bike.create({ 
        dock_id, 
        battery_level, 
        status, 
        charging_status 
      });
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${bike.id}/created`, {
        bike_id: bike.id,
        dock_id: bike.dock_id,
        battery_level: bike.battery_level,
        status: bike.status,
        charging_status: bike.charging_status,
        timestamp: new Date().toISOString()
      });
      
      res.status(201).json(bike);
    } catch (error) {
      console.error('Error creating bike:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update bike
  async updateBike(req, res) {
    try {
      const { id } = req.params;
      const { dock_id, battery_level, status, charging_status } = req.body;
      
      const bike = await Bike.update(id, { 
        dock_id, 
        battery_level, 
        status, 
        charging_status 
      });
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${bike.id}/status`, {
        bike_id: bike.id,
        dock_id: bike.dock_id,
        battery_level: bike.battery_level,
        status: bike.status,
        charging_status: bike.charging_status,
        timestamp: new Date().toISOString()
      });
      
      res.json(bike);
    } catch (error) {
      console.error('Error updating bike:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update bike status only
  async updateBikeStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      
      const bike = await Bike.updateStatus(id, status);
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${bike.id}/status`, {
        bike_id: bike.id,
        status: bike.status,
        timestamp: new Date().toISOString()
      });
      
      res.json(bike);
    } catch (error) {
      console.error('Error updating bike status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update bike battery level
  async updateBikeBattery(req, res) {
    try {
      const { id } = req.params;
      const { battery_level } = req.body;
      
      if (battery_level === undefined || battery_level < 0 || battery_level > 100) {
        return res.status(400).json({ error: 'Valid battery level (0-100) is required' });
      }
      
      const bike = await Bike.updateBatteryLevel(id, battery_level);
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${bike.id}/battery`, {
        bike_id: bike.id,
        battery_level: bike.battery_level,
        timestamp: new Date().toISOString()
      });
      
      res.json(bike);
    } catch (error) {
      console.error('Error updating bike battery:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update bike charging status
  async updateBikeCharging(req, res) {
    try {
      const { id } = req.params;
      const { charging_status } = req.body;
      
      const validChargingStatuses = ['not_charging', 'charging', 'fully_charged'];
      if (!charging_status || !validChargingStatuses.includes(charging_status)) {
        return res.status(400).json({ 
          error: `Valid charging status is required: ${validChargingStatuses.join(', ')}` 
        });
      }
      
      const bike = await Bike.updateChargingStatus(id, charging_status);
      
      if (!bike) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${bike.id}/charging`, {
        bike_id: bike.id,
        charging_status: bike.charging_status,
        battery_level: bike.battery_level,
        timestamp: new Date().toISOString()
      });
      
      res.json(bike);
    } catch (error) {
      console.error('Error updating bike charging status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete bike
  async deleteBike(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Bike.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Bike not found' });
      }
      
      // Notify via MQTT
      mqttClient.publish(`bikeshare/bikes/${id}/deleted`, {
        bike_id: id,
        timestamp: new Date().toISOString()
      });
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting bike:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = bikeController;