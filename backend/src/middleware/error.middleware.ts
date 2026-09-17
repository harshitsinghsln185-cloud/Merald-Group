import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/apiResponse';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error('[Unhandled Error]:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Enterprise Server Error';

  return sendResponse(res, statusCode, false, message);
};
