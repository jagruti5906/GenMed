import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(err: AppError, req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
  res.status(statusCode).json({
    success: false,
    error: { code: errorCode, message: err.message || 'An unexpected internal server error occurred.', details: err.details || undefined }
  });
}
