import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employees/employee.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import { errorHandler } from './middleware/error.middleware';
import { sendResponse } from './utils/apiResponse';

dotenv.config();

const app: Application = express();

// Configure authoritative CORS for production and development
const getCleanOrigins = (raw?: string): string[] => {
  if (!raw) return [];
  return raw
    .split(',')
    .map((u) => u.trim().toLowerCase().replace(/\/$/, ''))
    .filter(Boolean);
};

const DEFAULT_DEV_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (e.g. mobile apps, Postman, server-to-server health checks)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().toLowerCase().replace(/\/$/, '');
    const configuredOrigins = getCleanOrigins(process.env.CLIENT_URL);

    // 2. Development Mode: Allow local frontend dev ports + any configured CLIENT_URL
    if (process.env.NODE_ENV !== 'production') {
      if (
        DEFAULT_DEV_ORIGINS.includes(cleanOrigin) ||
        configuredOrigins.includes(cleanOrigin) ||
        configuredOrigins.includes('*') ||
        cleanOrigin.startsWith('http://localhost:') ||
        cleanOrigin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback allow in local dev mode
    }

    // 3. Production Mode: Match against process.env.CLIENT_URL origins
    if (configuredOrigins.length > 0) {
      if (configuredOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }
    } else {
      // Fallback if CLIENT_URL env var is not yet configured on Render initialization
      return callback(null, true);
    }

    return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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

// Serve Static Frontend dist ONLY if present (e.g. monorepo local preview)
const frontendBuildPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(path.resolve(frontendBuildPath, 'index.html'))) {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req: Request, res: Response, next: NextFunction) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/v1')) {
      return next();
    }
    res.sendFile(path.resolve(frontendBuildPath, 'index.html'));
  });
}

// 404 Route Handler
app.use((req: Request, res: Response) => {
  return sendResponse(res, 404, false, `API Endpoint ${req.originalUrl} not found`);
});

// Global Error Handler
app.use(errorHandler);

export default app;
