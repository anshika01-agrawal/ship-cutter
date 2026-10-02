import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ship_cutting_robot';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: Could not connect to MongoDB at ${uri}.`);
    console.warn(`   Reason: ${error.message}`);
    console.warn(`   Backend server will still run and serve static/API endpoints.`);
    return false;
  }
};
