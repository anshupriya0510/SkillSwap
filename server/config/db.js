import mongoose from 'mongoose';
import dns from 'dns';

export const connectDB = async () => {
  // In production MONGO_URI must be set; locally falls back to localhost
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';

  try {
    // Set standard DNS servers to resolve MongoDB Atlas SRV records reliably
    if (mongoUri.includes('mongodb+srv://')) {
      try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
      } catch {
        // Ignore if not allowed in specific environment
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1); // fatal — do not start without a DB
  }
};

