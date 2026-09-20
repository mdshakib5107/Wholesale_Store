import { OrderDTO } from '@/zod/schema';
import { db } from '@/db/index';
import { sql, eq } from 'drizzle-orm'
import { supplierSlipController } from '../supplierSlips/index'
import { orders, orderItems } from '@/db/schema/index'
import { stakeholderController } from '@/controller/stakeholder/index';
import { productController } from '@/controller/products/index'

export const placeOrder = async (data: OrderDTO) => {


  const { customerInfo } = data


  const order = await db.transaction(async (tx) => {
    const customerId = await stakeholderController.createCustomer(tx, customerInfo)
    if (!customerId) throw new Error('customerId not found')
    const [ insertedOrder ] = await tx.insert(orders).values({ customerId }).returning({ orderId: orders.orderId });
    if (!insertedOrder) throw new Error("insert order  failed")
    const slipItems: any = []
    const orderData = await Promise.all(data.orderItems.map(async (item: any) => {
      const price = item.price + 2
      const productId = await productController.findProduct({ supplierName: item.supplierName, gariNo: item.gariNo });
      const supplierSlipId = await supplierSlipController.findSupplierSlip(tx, productId)
        ;
      slipItems.push({ size: item.size, quantity: item.quantity, price: item.price, total: item.quantity * item.price, supplierSlipId: supplierSlipId!, productId: productId! })
      return { size: item.size, quantity: item.quantity, price, total: item.quantity * price, orderId: insertedOrder?.orderId!, productId: productId! }
    })
    )

    const totalAmount = orderData.reduce((acc, item) => acc += item.total, 0)

    const insertOrderItem = await tx.insert(orderItems).values(orderData).returning()
    if (insertOrderItem.length === 0) throw new Error("insert order item failed")
    await supplierSlipController.createSlipItem(tx, slipItems)
    const [ updateOrder ] = await tx.update(orders).set({ totalAmount, due: totalAmount }).where(eq(orders.orderId, insertedOrder.orderId)).returning()
    await stakeholderController.updateCustomerTotalAmount(tx, customerId, totalAmount)
    return {
      orderitemData: insertOrderItem,
      orderData: updateOrder
    }
  })
  return order
}
