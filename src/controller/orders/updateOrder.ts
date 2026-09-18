import { DBTransaction } from '@/db/types'
import { orders } from '@/db/schema'
import { findOrder } from './findOrder'
import { eq } from 'drizzle-orm'
export const updateOrder = async (tx: DBTransaction, orderId: string, orderStatus: string
) => {
  await findOrder(tx, orderId);
  const [ updatedOrder ] = await tx.update(orders).set({ status: orderStatus }).where(eq(orders.orderId, orderId)).returning()
  if (!updatedOrder) throw new Error("Failed to update order")
  return updatedOrder

}