import { Request, Response, NextFunction } from 'express';

export const health = async (_req: Request, res: Response, _next: NextFunction) => {
  res.status(200).json({
    message: 'Up'
  })
}