import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      traceId: string;
    }
  }
}

export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  req.traceId = req.headers['x-trace-id'] as string || uuidv4();
  res.setHeader('x-trace-id', req.traceId);
  next();
};