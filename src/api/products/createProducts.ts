import { Request, Response, NextFunction } from 'express';
import { zodErrorResponse } from '@/helpers/zodErrorResponse';
import { ProductDTOSchema } from '@/zod/schema';
import { productController } from '@/controller/products/index'
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = ProductDTOSchema.safeParse(req.body);
    if (!parsedData.success) {
      zodErrorResponse(parsedData, res)
      return
    }
    const productData = await productController.createProducts(parsedData.data)


    res.status(201).json({
      success: true,
      data: productData
    })
  } catch (e) {
    next(e)
  }


}