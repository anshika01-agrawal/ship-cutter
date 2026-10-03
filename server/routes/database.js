import express from 'express';
import mongoose from 'mongoose';
import Ship from '../models/Ship.js';
import CuttingOperation from '../models/CuttingOperation.js';
import Part from '../models/Part.js';
import Material from '../models/Material.js';
import Maintenance from '../models/Maintenance.js';
import Feasibility from '../models/Feasibility.js';
import Photo from '../models/Photo.js';
import BlogPost from '../models/BlogPost.js';
import Contact from '../models/Contact.js';
import { defaultShips, defaultParts, defaultOperation, defaultMaterials, defaultMaintenance, defaultFeasibility } from '../config/seedData.js';

const router = express.Router();

// GET database status and connection info
router.get('/status', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const states = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbState = states[mongoose.connection.readyState] || 'Unknown';
  const host = isConnected ? mongoose.connection.host : 'Not connected (Mock Fallback Mode)';
  const dbName = isConnected ? mongoose.connection.name : 'ship_cutting_robot (Local Fallback)';

  let collectionCounts = {};
  if (isConnected) {
    try {
      const [ships, parts, ops, mats, maint, feas, photos, blogs, contacts] = await Promise.all([
        Ship.countDocuments(),
        Part.countDocuments(),
        CuttingOperation.countDocuments(),
        Material.countDocuments(),
        Maintenance.countDocuments(),
        Feasibility.countDocuments(),
        Photo.countDocuments(),
        BlogPost.countDocuments(),
        Contact.countDocuments(),
      ]);
      collectionCounts = { ships, parts, operations: ops, materials: mats, maintenance: maint, feasibility: feas, photos, blogs, contacts };
    } catch (err) {
      console.warn('Error reading collection counts:', err.message);
    }
  } else {
    collectionCounts = {
      ships: defaultShips.length,
      parts: defaultParts.length,
      operations: 1,
      materials: 1,
      maintenance: 1,
      feasibility: 1,
      photos: 4,
      blogs: 3,
      contacts: 0,
    };
  }

  res.json({
    status: isConnected ? 'online' : 'fallback',
    connectionState: dbState,
    databaseEngine: 'MongoDB + Mongoose ODM',
    host,
    dbName,
    configuredUri: process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/:([^@]+)@/, ':****@') : 'mongodb://127.0.0.1:27017/ship_cutting_robot',
    collections: collectionCounts,
    timestamp: new Date().toISOString(),
  });
});

// GET full database snapshot for the Database Viewer UI
router.get('/inspect', async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  if (isConnected) {
    try {
      const [ships, parts, operations, materials, maintenance, feasibility, photos, blogs, contacts] = await Promise.all([
        Ship.find().lean(),
        Part.find().lean(),
        CuttingOperation.find().lean(),
        Material.find().lean(),
        Maintenance.find().lean(),
        Feasibility.find().lean(),
        Photo.find().lean(),
        BlogPost.find().lean(),
        Contact.find().lean(),
      ]);

      return res.json({
        dataSource: 'Live MongoDB Database',
        collections: {
          ships: ships.length ? ships : defaultShips,
          parts: parts.length ? parts : defaultParts,
          operations: operations.length ? operations : [defaultOperation],
          materials: materials.length ? materials : [defaultMaterials],
          maintenance: maintenance.length ? maintenance : [defaultMaintenance],
          feasibility: feasibility.length ? feasibility : [defaultFeasibility],
          photos,
          blogs,
          contacts,
        },
      });
    } catch (err) {
      console.warn('Inspect error:', err.message);
    }
  }

  // Fallback data when Mongo isn't running locally yet
  res.json({
    dataSource: 'In-Memory Fallback Seed (Connect MongoDB for persistent writes)',
    collections: {
      ships: defaultShips,
      parts: defaultParts,
      operations: [defaultOperation],
      materials: [defaultMaterials],
      maintenance: [defaultMaintenance],
      feasibility: [defaultFeasibility],
      photos: [],
      blogs: [],
      contacts: [],
    },
  });
});

export default router;
