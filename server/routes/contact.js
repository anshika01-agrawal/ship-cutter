import express from 'express';
import Contact from '../models/Contact.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      const contact = new Contact({ name, email, phone, company, subject, message });
      const saved = await contact.save();
      return res.status(201).json({ success: true, message: 'Message received successfully!', data: saved });
    }

    return res.status(201).json({
      success: true,
      message: 'Message received successfully! (Simulated Mode)',
      data: { name, email, subject, message, date: new Date().toISOString() },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
