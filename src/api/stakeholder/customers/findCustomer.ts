import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '@/helpers/customErrors'
import { customerController } from '@/controller/stakeholder/customers/index'
export const findCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* code */
    const { customerId } = req.params
    if (!customerId || typeof customerId !== 'string') throw new BadRequestError()
    const customer = await customerController.findCustomer(customerId)
    res.status(200).json({
      success: true,
      data: customer
    })
  } catch (e) {
    next(e)
  }
}