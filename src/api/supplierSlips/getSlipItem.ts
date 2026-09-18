import { Request, Response, NextFunction } from 'express';
import { supplierSlipController } from '@/controller/supplierSlips/index';

export const getSlipItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { supplierName } = req.query
    const gariNo = Number(req.query.gariNo)
    if ((typeof supplierName !== "string") || (typeof gariNo !== 'number')) throw new Error("Bd request")

    const data = await supplierSlipController.getSlipItem({ supplierName, gariNo });
    res.status(200).json({
      success: true,
      data
    })
  } catch (error) {
    next(error)
  }
}