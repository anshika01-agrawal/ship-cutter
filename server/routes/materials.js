import express from 'express';
import Material from '../models/Material.js';
import { defaultMaterials } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const mats = await Material.find().sort({ createdAt: -1 });
      if (mats.length > 0) return res.json(mats[0]);
    }
    return res.json(defaultMaterials);
  } catch (err) {
    return res.json(defaultMaterials);
  }
});

export default router;
