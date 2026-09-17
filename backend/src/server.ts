import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const numericPort = Number(PORT);
  app.listen(numericPort, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`  Merald Group Enterprise TypeScript API v1 Server`);
    console.log(`  Port: ${numericPort} | Host: 0.0.0.0 | Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
};

startServer();
