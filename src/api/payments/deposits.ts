import { Request, Response, NextFunction } from 'express';
import { DepositDTOSchema } from '@/zods/schema'
import { zodErrorResponse } from '@/helpers/zodErrorResponse';
import { paymentController } from '@/controller/payments/index'
export const deposits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = DepositDTOSchema.safeParse(req.body);
    if (!parsedData.success) {
      zodErrorResponse(parsedData, res)
      return
    }


    const result = await paymentController.deposits(parsedData.data)



    res.status(201).json({
      message: 'Ok',
      data: result
    })




  } catch (error) {
    next(error)
  }
}