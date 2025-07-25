const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');
const mqttClient = require('./config/mqtt');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const userRoutes = require('./routes/userRoutes');
const dockRoutes = require('./routes/dockRoutes');
const bikeRoutes = require('./routes/bikeRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/docks', dockRoutes);
app.use('/api/bikes', bikeRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bikeshare API is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Test database connection
  await testConnection();
  
  // Initialize MQTT connection
  try {
    mqttClient.connect();
  } catch (error) {
    console.error('Failed to connect to MQTT broker:', error.message);
  }
});

module.exports = app;