import { db } from '@/db/index';
import { orders } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '@/helpers/customErrors'
export const getOrdersByCustomerId = async (customerId: string) => {
  const customerOrders = await db.query.orders.findMany({
    where: eq(orders.customerId, customerId)
  });
  if (customerOrders.length === 0) {
    throw new NotFoundError('orders not found')
  }
  return customerOrders
}