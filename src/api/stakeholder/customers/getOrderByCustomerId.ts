import { Request, Response, NextFunction } from 'express';
import { orderController } from '@/controller/orders/index';
import { BadRequestError } from '@/helpers/customErrors'
export const getOrdersByCustomerId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /* code */
    const { customerId } = req.params
    if (!customerId || typeof customerId !== 'string') throw new BadRequestError()
    const orders = await orderController.getOrdersByCustomerId(customerId)
    res.status(200).json({
      success: true,
      data: orders
    })
  } catch (e) {
    next(e)
  }
}