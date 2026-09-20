import { DBTransaction } from '@/db/types'
import { orders } from '@/db/schema'
import { findOrder } from './findOrder'
import { eq } from 'drizzle-orm'
type OrderData = {
  orderId: string, orderStatus: string, due: number, discount?: number
}
export const updateOrder = async (tx: DBTransaction,
  data: OrderData) => {
  await findOrder(tx, data.orderId);

  const [ updatedOrder ] = await tx.update(orders).set({ status: data.orderStatus, due: data.due, ...(data.discount !== undefined && { discount: data.discount }) }).where(eq(orders.orderId, data.orderId)).returning()
  if (!updatedOrder) throw new Error("Failed to update order")
  return updatedOrder

}