import { Request, Response, NextFunction } from 'express';

import { customerController } from '@/controller/stakeholder/customers/index'
export const getAllCustomers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    /* code */

    const customers = await customerController.getAllCustomers()
    res.status(200).json({
      success: true,
      data: customers
    })
  } catch (e) {
    next(e)
  }
}