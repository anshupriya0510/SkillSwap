import mongoose from 'mongoose';

export const connectDB = async () => {
  // In production MONGO_URI must be set; locally falls back to localhost
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // fatal — do not start without a DB
  }
};
