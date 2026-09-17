import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`  Merald Group Enterprise TypeScript API v1 Server`);
    console.log(`  Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
};

startServer();
