import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../modules/auth/auth.model';
import { sendResponse } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  admin?: any;
}

export const protectAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || 'merald_group_enterprise_secret_jwt_key_2026_super_secure'
      );

      try {
        const found = await Admin.findById(decoded.id).select('-password');
        if (found) {
          req.admin = found;
          return next();
        }
      } catch (err) {
        // Fallback for demo token
      }

      req.admin = { id: decoded.id, email: decoded.email, name: decoded.name || 'Admin' };
      return next();
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, missing bearer token');
  }
};
