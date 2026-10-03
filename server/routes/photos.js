import express from 'express';
import { upload } from '../middleware/upload.js';
import Photo from '../models/Photo.js';
import mongoose from 'mongoose';

const router = express.Router();

const defaultPhotos = [
  {
    _id: 'ph-1',
    title: 'Magnetic Crawler Vertical Hull Plasma Arc',
    url: '/uploads/crawler_hull_cut.jpg',
    category: 'robot',
    tags: ['crawler', 'plasma', 'drydock', 'adhesion'],
    description: 'Autonomous crawler tractor scaling vertical ship hull plate with 400A plasma torch arc',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-2',
    title: 'LiDAR Drone Cargo Hold 3D Structural Scan',
    url: '/uploads/drone_ship_scan.jpg',
    category: 'robot',
    tags: ['drone', 'lidar', 'cargo-hold', '3d-mapping'],
    description: 'Aerial inspection drone mapping hull bulkheads with high-density laser scan grid',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-3',
    title: 'Quadruped Engine Room Hazard Patrol Robot',
    url: '/uploads/quadruped_ship_robot.jpg',
    category: 'robot',
    tags: ['quadruped', 'thermal', 'engine-room', 'safety'],
    description: 'Robotic inspection dog traversing narrow gangways with thermal imaging and gas sniffing probes',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-4',
    title: 'High-Power Hydraulic Demolition Shear Robot',
    url: '/uploads/heavy_robotic_shear.jpg',
    category: 'machine',
    tags: ['shear', 'hydraulic', 'bulkhead', 'demolition'],
    description: 'Heavy demolition robotic arm slicing naval armor steel girders with 600-ton hydraulic bite force',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-5',
    title: 'Automated CNC Gantry Multi-Torch Deck Cutter',
    url: '/uploads/gantry_plasma_cutter.jpg',
    category: 'machine',
    tags: ['cnc', 'gantry', 'deck-plate', 'mist-suppression'],
    description: 'Multi-axis CNC plasma gantry profiling thick marine deck plating with water-mist cooling',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-6',
    title: '6-Axis Articulated Arm with Thermal Standoff Torch',
    url: '/uploads/robot_arm_torch.jpg',
    category: 'machine',
    tags: ['torch', 'articulated', 'arm', 'ultrasonic'],
    description: 'Multi-joint robotic arm performing automated bevel cuts with ultrasonic standoff control',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-7',
    title: 'KRAN-VULCAN Neodymium Magnetic Chassis',
    url: '/uploads/kran_vulcan_crawler.jpg',
    category: 'robot',
    tags: ['robot', 'kran-vulcan', 'neodymium', 'tracks'],
    description: 'High-traction continuous rubber tracks with embedded neodymium magnets for vertical grip',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'ph-8',
    title: 'High-Precision Automated Plasma Kerf Standoff Head',
    url: '/uploads/plasma_cut_hull.jpg',
    category: 'cutting',
    tags: ['plasma', 'kerf', 'standoff', 'sensor'],
    description: 'Initial height sensing and closed-loop arc voltage torch control traversing marine hull plate',
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
