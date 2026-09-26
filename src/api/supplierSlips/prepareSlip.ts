import { Request, Response, NextFunction } from 'express';
import { SupplierSlipDTOSchema } from '@/zod/schema';
import { zodErrorResponse } from "@/helpers/zodErrorResponse";
import { supplierSlipController } from '@/controller/supplierSlips/index'
export const prepareSlip = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const parsedData = SupplierSlipDTOSchema.safeParse(req.body);
    if (!parsedData.success) {
      zodErrorResponse(parsedData, res)
      return
    }

    const slips = await supplierSlipController.prepareSlip(parsedData.data)
    res.status(201).json({
      success: true,
      data: slips
    })
  } catch (error) {
    next(error)
  }
}