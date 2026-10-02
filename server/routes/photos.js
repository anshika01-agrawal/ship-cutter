import express from 'express';
import { upload } from '../middleware/upload.js';
import Photo from '../models/Photo.js';
import mongoose from 'mongoose';

const router = express.Router();

const defaultPhotos = [
  {
    _id: 'ph-1',
    title: 'Plasma Cut on Main Hull Plate',
    url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    category: 'cutting',
    tags: ['plasma', 'hull', 'precision'],
    description: 'Autonomous crawler torch traversing 30mm steel plate',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-2',
    title: 'Dismantled Stern Section',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    category: 'before_after',
    tags: ['stern', 'dismantling', 'crane'],
    description: 'Extracted stern section staged for scrap recycling',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-3',
    title: 'High Tensile Beam Cross-Section',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    category: 'parts',
    tags: ['beam', 'structural', 'steel'],
    description: 'Clean kerf cut with zero thermal distortion',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-4',
    title: 'Titan-X1 Robotic Crawler',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    category: 'robot',
    tags: ['robot', 'titan-x1', 'sensors'],
    description: 'LiDAR and magnetic track deployment on vertical bulkhead',
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
