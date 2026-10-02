import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import shipRoutes from './routes/ships.js';
import operationRoutes from './routes/operations.js';
import partRoutes from './routes/parts.js';
import materialRoutes from './routes/materials.js';
import maintenanceRoutes from './routes/maintenance.js';
import feasibilityRoutes from './routes/feasibility.js';
import photoRoutes from './routes/photos.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded assets statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Ship Cutting Robot API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/ships', shipRoutes);
app.use('/api/operations', operationRoutes);
app.use('/api/parts', partRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/feasibility', feasibilityRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);

// Root fallback
app.get('/', (req, res) => {
  res.send('🚢 Ship Cutting Robot Management API is operational.');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Ship Cutting Backend Server running on http://localhost:${PORT}`);
});
