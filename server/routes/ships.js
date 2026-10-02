import express from 'express';
import Ship from '../models/Ship.js';
import { defaultShips } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET all ships
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ships = await Ship.find().sort({ createdAt: -1 });
      if (ships.length > 0) return res.json(ships);
    }
    return res.json(defaultShips);
  } catch (err) {
    console.error('Error fetching ships:', err);
    return res.json(defaultShips);
  }
});

// GET ship by ID
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ship = await Ship.findById(req.params.id);
      if (ship) return res.json(ship);
    }
    const fallback = defaultShips.find(s => s._id === req.params.id) || defaultShips[0];
    return res.json(fallback);
  } catch (err) {
    return res.json(defaultShips[0]);
  }
});

// POST new ship
router.post('/', async (req, res) => {
  try {
    const { name, type, dimensions, weight, status, notes, photos } = req.body;
    if (mongoose.connection.readyState === 1) {
      const newShip = new Ship({
        name,
        type,
        dimensions: dimensions || { length: 0, width: 0, height: 0 },
        weight: Number(weight) || 0,
        status: status || 'docked',
        notes: notes || '',
        photos: photos || [],
      });
      const saved = await newShip.save();
      return res.status(201).json(saved);
    }
    // In-memory response if DB disconnected
    const mockCreated = {
      _id: `mock-${Date.now()}`,
      name,
      type,
      dimensions,
      weight,
      status: status || 'docked',
      notes,
      photos: photos || [],
      createdAt: new Date().toISOString(),
    };
    return res.status(201).json(mockCreated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
