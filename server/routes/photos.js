import express from 'express';
import { upload } from '../middleware/upload.js';
import Photo from '../models/Photo.js';
import mongoose from 'mongoose';

const router = express.Router();

const defaultPhotos = [
  {
    _id: 'ph-1',
    title: 'Plasma Cut on Main Hull Plate',
    url: '/uploads/plasma_cut_hull.jpg',
    category: 'cutting',
    tags: ['plasma', 'hull', 'standoff', 'hypertherm'],
    description: 'Autonomous crawler torch traversing 28mm IS 2062 steel plate with Initial Height Sensing',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-2',
    title: 'Manual Hull Dismantling (Legacy Danger Zone)',
    url: '/uploads/manual_hull_cutting_torch.jpg',
    category: 'before_after',
    tags: ['stern', 'dismantling', 'alang'],
    description: 'Extracted stern section with hazardous manual torch operation - now replaced by robotics',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-3',
    title: 'Ladder-Based Manual Hull Torch Cutting',
    url: '/uploads/manual_hull_cutting_ladder.jpg',
    category: 'before_after',
    tags: ['beam', 'structural', 'steel', 'manual'],
    description: 'Dangerous manual scaffolding operation eliminated by autonomous magnetic crawler robotics',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-4',
    title: 'KRAN-VULCAN Robotic Crawler',
    url: '/uploads/kran_vulcan_crawler.jpg',
    category: 'robot',
    tags: ['robot', 'kran-vulcan', 'neodymium', 'sensors'],
    description: 'Continuous magnetic track deployment on vertical ship hull with Raspberry Pi & ESP32 bay',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-5',
    title: 'Articulated Arm with Thermal Cutting Torch',
    url: '/uploads/robot_arm_torch.jpg',
    category: 'cutting',
    tags: ['torch', 'articulated', 'arm', 'plasma'],
    description: 'Multi-joint industrial robotic arm cutting steel hull plate with ultrasonic standoff probe',
    createdAt: new Date().toISOString()
  }
];

// GET photos
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const photos = await Photo.find().sort({ createdAt: -1 });
      if (photos.length > 0) return res.json(photos);
    }
    return res.json(defaultPhotos);
  } catch (err) {
    return res.json(defaultPhotos);
  }
});

// POST photo upload
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const { title, category, description, tags, shipId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    const newPhotoData = {
      title: title || req.file.originalname,
      filename: req.file.filename,
      url: fileUrl,
      category: category || 'cutting',
      description: description || '',
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      metadata: {
        size: req.file.size,
        mimeType: req.file.mimetype,
      }
    };

    if (mongoose.connection.readyState === 1) {
      const photoDoc = new Photo(newPhotoData);
      const saved = await photoDoc.save();
      return res.status(201).json(saved);
    }

    return res.status(201).json({
      _id: `upload-${Date.now()}`,
      ...newPhotoData,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
