import { Request, Response, NextFunction } from 'express';
import { PaymentDTOSchema } from '@/zods/schema'
import { zodErrorResponse } from '@/helpers/zodErrorResponse'
import { paymentController } from '@/controller/payments/index'
export const payment = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const parsedData = PaymentDTOSchema.safeParse(req.body);
    if (!parsedData.success) {
      zodErrorResponse(parsedData, res)
      return
    }
    const payment = await paymentController.payment(parsedData.data)
    res.status(201).json({
      success: true,
      data: payment
    })

  } catch (error) {
    next(error)
  }
}