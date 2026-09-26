import { Request, Response, NextFunction } from 'express';
import { SupplierPaymentDTOSchema } from '@/zod/schema'
import { zodErrorResponse } from '@/helpers/zodErrorResponse'
import { paymentController } from '@/controller/payments/index'

export const supplierPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = SupplierPaymentDTOSchema.safeParse(req.body)
    if (!parsedData.success) {
      await zodErrorResponse(parsedData, res)
      return
    }
    const data = await paymentController.slipPayment(parsedData.data)
    res.status(200).json({
      success: true,
      data
    })
  } catch (e) {
    next(e)
  }
}