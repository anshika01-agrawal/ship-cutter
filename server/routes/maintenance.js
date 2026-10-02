import express from 'express';
import Maintenance from '../models/Maintenance.js';
import { defaultMaintenance } from '../config/seedData.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const records = await Maintenance.find().sort({ scheduledDate: -1 });
      if (records.length > 0) {
        return res.json({
          robotId: records[0].robotId,
          robotStatus: records[0].robotStatus,
          components: records[0].components,
          logs: records,
        });
      }
    }
    return res.json(defaultMaintenance);
  } catch (err) {
    return res.json(defaultMaintenance);
  }
});

export default router;
