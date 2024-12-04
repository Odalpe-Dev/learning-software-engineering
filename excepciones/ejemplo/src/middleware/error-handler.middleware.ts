import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/base-exception';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response = {
    traceId: req.traceId,
    status: error instanceof BaseException ? error.status : 500,
    code: error instanceof BaseException ? error.code : 'INTERNAL_SERVER_ERROR',
    message: error.message || 'Error interno del servidor',
    details: error instanceof BaseException ? error.details : undefined
  };

  res.status(response.status).json(response);
};