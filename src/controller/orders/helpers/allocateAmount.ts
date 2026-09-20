import { orders } from '@/db/schema/index';
import { DBTransaction } from '@/db/types';
import { and, eq, ne, asc } from 'drizzle-orm';
import { orderController } from '../index';
import { BadRequestError } from '@/helpers/customErrors'
type Ids = {
  orderId: string | undefined,
  customerId: string | undefined,
  amount: number
}

interface Allocation {
  orderId: string;
  allocatedAmount: number;
  due: number;
  customerId?: string

}
export const allocateAmount = async (tx: DBTransaction, data: Ids) => {
  let remaining = data.amount
  let allocation: Allocation[] = []
  if (!data.customerId && !data.orderId) {
    throw new BadRequestError('Either orderId or customerId is required');
  }

  if (data.orderId) {

    const order = await orderController.findOrder(tx, data.orderId)
    if (order.status === 'paid') throw new Error('order is already paid')

    allocation.push({ orderId: order.orderId, allocatedAmount: data.amount, due: order.due ?? 0, customerId: order.customerId })
    return allocation
  }
  const allOrders = await tx.query.orders.findMany({
    where: and(eq(orders.customerId, data.customerId!), ne(orders.status, 'paid')),
    orderBy: asc(orders.createdAt)
  })
  for (let order of allOrders) {
    if (remaining <= 0) break;
    const due = order.due ?? 0
    const allocatedAmount = Math.min(remaining, due)
    allocation.push({ orderId: order.orderId, allocatedAmount, due })
    remaining -= allocatedAmount
  }
  return allocation
}