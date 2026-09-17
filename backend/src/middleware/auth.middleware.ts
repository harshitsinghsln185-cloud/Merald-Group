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
      const isProduction = process.env.NODE_ENV === 'production';
      const secret = process.env.JWT_SECRET || (isProduction ? '' : 'merald_group_enterprise_secret_jwt_key_2026_super_secure');

      if (!secret && isProduction) {
        return sendResponse(res, 500, false, 'Server configuration error: JWT secret is missing');
      }

      const decoded: any = jwt.verify(token, secret || 'merald_group_enterprise_secret_jwt_key_2026_super_secure');

      try {
        const found = await Admin.findById(decoded.id).select('-password');
        if (found) {
          if (found.status === 'DISABLED') {
            return sendResponse(res, 403, false, 'Admin account is disabled');
          }
          req.admin = found;
          return next();
        }
      } catch (err) {
        if (isProduction) {
          return sendResponse(res, 401, false, 'Invalid admin authorization session');
        }
      }

      if (!isProduction) {
        req.admin = { id: decoded.id, email: decoded.email, name: decoded.name || 'Admin' };
        return next();
      } else {
        return sendResponse(res, 401, false, 'Admin account not found or token invalid');
      }
    } catch (error) {
      return sendResponse(res, 401, false, 'Not authorized, token invalid or expired');
    }
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized, missing bearer token');
  }
};
