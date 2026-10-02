import express from 'express';
import Feasibility from '../models/Feasibility.js';
import { defaultFeasibility } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const reports = await Feasibility.find().sort({ createdAt: -1 });
      if (reports.length > 0) return res.json(reports[0]);
    }
    return res.json(defaultFeasibility);
  } catch (err) {
    return res.json(defaultFeasibility);
  }
});

export default router;
