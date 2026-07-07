import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/validation.error';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ValidationError) {
    res.status(400).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
