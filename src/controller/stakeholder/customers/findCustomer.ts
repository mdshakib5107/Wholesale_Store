import { db } from '@/db/index';
import { customers } from '@/db/schema/index';
import { eq } from 'drizzle-orm'
import { NotFoundError } from '@/helpers/customErrors'
export const findCustomer = async (customerId: string) => {
  const customer = await db.query.customers.findFirst({
    where: eq(customers.customerId, customerId)
  });
  if (!customer) throw new NotFoundError("Customer not found")
  return customer
}