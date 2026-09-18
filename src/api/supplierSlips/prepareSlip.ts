import { Request, Response, NextFunction } from 'express';
import { SupplierSlipDTOSchema } from '@/zod/schema';
import { zodErrorResponse } from "@/helpers/zodErrorResponse";
export const prepareSlip = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const parsedData = SupplierSlipDTOSchema.safeParse(req.body);
    if (!parsedData.success) {
      zodErrorResponse(parsedData, res)
      return
    }
    res.status(201).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}