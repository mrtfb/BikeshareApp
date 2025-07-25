const mqtt = require('mqtt');

class MQTTClient {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  connect() {
    const options = {
      host: process.env.MQTT_HOST || 'cornelias.pt',
      port: process.env.MQTT_PORT || 1883,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      keepalive: 60,
      reconnectPeriod: 1000,
      protocolId: 'MQIsdp',
      protocolVersion: 3,
      clean: true,
      encoding: 'utf8'
    };

    this.client = mqtt.connect(`mqtt://${options.host}:${options.port}`, options);

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.connected = true;
      this.subscribeToTopics();
    });

    this.client.on('error', (error) => {
      console.error('MQTT connection error:', error);
      this.connected = false;
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed');
      this.connected = false;
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message.toString());
    });
  }

  subscribeToTopics() {
    // Subscribe to bike status updates
    this.client.subscribe('bikeshare/bikes/+/status');
    this.client.subscribe('bikeshare/docks/+/status');
    this.client.subscribe('bikeshare/bikes/+/charging');
  }

  handleMessage(topic, message) {
    console.log(`Received message on ${topic}: ${message}`);
    
    try {
      const data = JSON.parse(message);
      
      if (topic.includes('/bikes/') && topic.includes('/status')) {
        this.handleBikeStatusUpdate(topic, data);
      } else if (topic.includes('/docks/') && topic.includes('/status')) {
        this.handleDockStatusUpdate(topic, data);
      } else if (topic.includes('/charging')) {
        this.handleChargingStatusUpdate(topic, data);
      }
    } catch (error) {
      console.error('Error parsing MQTT message:', error);
    }
  }

  handleBikeStatusUpdate(topic, data) {
    // Extract bike ID from topic
    const bikeId = topic.split('/')[2];
    console.log(`Bike ${bikeId} status update:`, data);
    // TODO: Update database with bike status
  }

  handleDockStatusUpdate(topic, data) {
    // Extract dock ID from topic
    const dockId = topic.split('/')[2];
    console.log(`Dock ${dockId} status update:`, data);
    // TODO: Update database with dock status
  }

  handleChargingStatusUpdate(topic, data) {
    // Extract bike ID from topic
    const bikeId = topic.split('/')[2];
    console.log(`Bike ${bikeId} charging status:`, data);
    // TODO: Update database with charging status
  }

  publish(topic, message) {
    if (this.connected && this.client) {
      this.client.publish(topic, JSON.stringify(message));
    } else {
      console.error('MQTT client not connected');
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

const mqttClient = new MQTTClient();
module.exports = mqttClient;