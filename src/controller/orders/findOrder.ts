import { eq } from 'drizzle-orm'
import { orders } from '@/db/schema/index'
import { DBTransaction } from '@/db/types';
import { NotFoundError } from '@/helpers/customErrors'
export const findOrder = async (tx: DBTransaction, orderId: string) => {
  const order = await tx.query.orders.findFirst({
    where: eq(orders.orderId, orderId)
  })
  if (!order) throw new NotFoundError("Order not Found!")
  return order
}