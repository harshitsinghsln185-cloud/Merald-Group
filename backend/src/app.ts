import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employees/employee.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import { errorHandler } from './middleware/error.middleware';
import { sendResponse } from './utils/apiResponse';

dotenv.config();

const app: Application = express();

// Configure CORS for production and development
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((u) => u.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        allowedOrigins.includes('*')
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access from origin: ${origin}`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve Uploads if present
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check API
app.get('/api/v1/health', (req: Request, res: Response) => {
  return sendResponse(res, 200, true, 'Merald Group Enterprise API v1 Online', {
    system: 'Merald Group SaaS Backend',
    version: '2.0.0',
    timestamp: new Date(),
  });
});

// API Routes Namespace /api/v1 and route aliases
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admins', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/invoices', invoiceRoutes);

app.use('/v1/auth', authRoutes);
app.use('/v1/admins', authRoutes);
app.use('/v1/employees', employeeRoutes);
app.use('/v1/invoices', invoiceRoutes);

// Fallback compatibility routes for legacy frontend calls
app.use('/api/admin', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/invoice', invoiceRoutes);

// Serve Static Frontend dist if building in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(buildPath));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(buildPath, 'index.html'));
  });
}

// 404 Route Handler
app.use((req: Request, res: Response) => {
  return sendResponse(res, 404, false, `API Endpoint ${req.originalUrl} not found`);
});

// Global Error Handler
app.use(errorHandler);

export default app;
