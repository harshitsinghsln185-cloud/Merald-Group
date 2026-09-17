import { Response } from 'express';

export interface ApiResponsePayload<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: any;
  stats?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  pagination?: any,
  stats?: any
): Response => {
  const payload: ApiResponsePayload<T> = {
    success,
    message,
  };

  if (data !== undefined) payload.data = data;
  if (pagination !== undefined) payload.pagination = pagination;
  if (stats !== undefined) payload.stats = stats;

  return res.status(statusCode).json(payload);
};
