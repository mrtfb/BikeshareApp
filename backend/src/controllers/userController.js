const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Create new user
  async createUser(req, res) {
    try {
      const { email, name, phone } = req.body;
      
      // Basic validation
      if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
      }
      
      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }
      
      const user = await User.create({ email, name, phone });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { email, name, phone } = req.body;
      
      // Basic validation
      if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
      }
      
      const user = await User.update(id, { email, name, phone });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Delete user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const deleted = await User.delete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = userController;