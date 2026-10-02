import express from 'express';
import CuttingOperation from '../models/CuttingOperation.js';
import { defaultOperation } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET current/active cutting operation
router.get('/active', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const active = await CuttingOperation.findOne({ status: 'running' }).populate('shipId');
      if (active) return res.json(active);
    }
    return res.json(defaultOperation);
  } catch (err) {
    return res.json(defaultOperation);
  }
});

// GET all operations
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const ops = await CuttingOperation.find().populate('shipId').sort({ createdAt: -1 });
      if (ops.length > 0) return res.json(ops);
    }
    return res.json([defaultOperation]);
  } catch (err) {
    return res.json([defaultOperation]);
  }
});

export default router;
