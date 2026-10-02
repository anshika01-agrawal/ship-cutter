import express from 'express';
import Part from '../models/Part.js';
import { defaultParts } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const parts = await Part.find().sort({ createdAt: -1 });
      if (parts.length > 0) return res.json(parts);
    }
    return res.json(defaultParts);
  } catch (err) {
    return res.json(defaultParts);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, partId, type, weight, thickness, status, notes, shipId } = req.body;
    if (mongoose.connection.readyState === 1) {
      const newPart = new Part({ name, partId, type, weight, thickness, status, notes, shipId });
      const saved = await newPart.save();
      return res.status(201).json(saved);
    }
    return res.status(201).json({
      _id: `part-${Date.now()}`,
      name,
      partId: partId || `P-${Date.now().toString().slice(-4)}`,
      type,
      weight,
      thickness,
      status: status || 'pending',
      notes,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
