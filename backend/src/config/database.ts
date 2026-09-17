import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merald_group_db';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
  } catch (error: any) {
    console.warn(`[MongoDB Warning]: Connection failed (${error.message}). Running with in-memory state fallbacks.`);
  }
};
