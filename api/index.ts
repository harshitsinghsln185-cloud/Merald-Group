import app from '../backend/src/app';
import { connectDB } from '../backend/src/config/database';

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to connect to MongoDB in serverless handler:', err);
  }
  return app(req, res);
}
