const express = require('express');
const router = express.Router();
const bikeController = require('../controllers/bikeController');

// GET /api/bikes - Get all bikes
router.get('/', bikeController.getAllBikes);

// GET /api/bikes/:id - Get bike by ID
router.get('/:id', bikeController.getBikeById);

// GET /api/bikes/dock/:dockId - Get bikes by dock
router.get('/dock/:dockId', bikeController.getBikesByDock);

// POST /api/bikes - Create new bike
router.post('/', bikeController.createBike);

// PUT /api/bikes/:id - Update bike
router.put('/:id', bikeController.updateBike);

// PATCH /api/bikes/:id/status - Update bike status only
router.patch('/:id/status', bikeController.updateBikeStatus);

// PATCH /api/bikes/:id/battery - Update bike battery level
router.patch('/:id/battery', bikeController.updateBikeBattery);

// PATCH /api/bikes/:id/charging - Update bike charging status
router.patch('/:id/charging', bikeController.updateBikeCharging);

// DELETE /api/bikes/:id - Delete bike
router.delete('/:id', bikeController.deleteBike);

module.exports = router;