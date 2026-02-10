import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
import { ZodError } from 'zod';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'ValidationError',
      message: err.errors.map((e) => e.message).join(', '),
      statusCode: 400,
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'InternalError',
    message: 'Something went wrong. Please try again.',
    statusCode: 500,
  });
}
