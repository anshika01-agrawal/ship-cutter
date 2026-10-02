import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    company: { type: String, default: '' },
    subject: { type: String, default: 'General Inquiry' },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'contacted', 'archived'],
      default: 'unread',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
