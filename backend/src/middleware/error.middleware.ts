import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('[Unhandled Server Error]:', err);

  // Handle MongoDB Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const val = err.keyValue ? err.keyValue[field] : '';
    const formattedMessage = `A record with this ${field} ("${val}") already exists.`;
    return sendResponse(res, 400, false, formattedMessage);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message).join(', ');
    return sendResponse(res, 400, false, `Validation Error: ${messages}`);
  }

  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  const message = isProduction && statusCode === 500
    ? 'Internal Enterprise Server Error'
    : (err.message || 'Internal Enterprise Server Error');

  return sendResponse(res, statusCode, false, message);
};
