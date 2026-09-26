
import { Request, Response, NextFunction } from 'express';
import { OrderDTOSchema } from '@/zods/schema';
import { orderController } from "@/controller/orders/index"
export const placeOrder = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const parsedData = OrderDTOSchema.safeParse(req.body)

    if (!parsedData.success) {

      return res.status(400).json({
        success: false,
        errors: parsedData.error.issues.map((e: any) => ({ expected: e.expected, path: e.path, message: e.message }))
      })
    }

    const data = await orderController.placeOrder(parsedData.data)


    //TODO send proper response 
    res.status(201).json({
      success: true,
      data
    })
  } catch (e) {
    next(e)
  }
}
