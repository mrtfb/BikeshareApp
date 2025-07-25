const express = require('express');
const router = express.Router();
const dockController = require('../controllers/dockController');

// GET /api/docks - Get all docks
router.get('/', dockController.getAllDocks);

// GET /api/docks/:id - Get dock by ID
router.get('/:id', dockController.getDockById);

// GET /api/docks/:id/bikes - Get dock with bikes
router.get('/:id/bikes', dockController.getDockWithBikes);

// POST /api/docks - Create new dock
router.post('/', dockController.createDock);

// PUT /api/docks/:id - Update dock
router.put('/:id', dockController.updateDock);

// DELETE /api/docks/:id - Delete dock
router.delete('/:id', dockController.deleteDock);

module.exports = router;