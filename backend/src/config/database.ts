import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const mongoURI = process.env.MONGODB_URI || (isProduction ? '' : 'mongodb://127.0.0.1:27017/merald_group_db');

  if (!mongoURI) {
    if (isProduction) {
      console.error('[MongoDB Critical Error]: MONGODB_URI environment variable is missing in production!');
      throw new Error('MONGODB_URI configuration is missing');
    } else {
      console.warn('[MongoDB Warning]: MONGODB_URI not provided. Running with in-memory state fallbacks.');
      return;
    }
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
  } catch (error: any) {
    if (isProduction) {
      console.error(`[MongoDB Error]: Production database connection failed: ${error.message}`);
      throw error;
    }
    console.warn(`[MongoDB Warning]: Connection failed (${error.message}). Running in development mode with fallbacks.`);
  }
};

