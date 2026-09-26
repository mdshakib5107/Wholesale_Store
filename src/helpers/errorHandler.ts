import { Request, Response, NextFunction } from 'express';
import { AppError } from './customErrors'
export const errorHandler = async (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    })
  }

  console.log('from errorHandler: ', err)
  return res.status(500).json({
    success: false,
    error: err.message ? err.message : "Something went wrong"
  })
}