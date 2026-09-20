import { DBTransaction } from '@/db/types';
import { customers } from '@/db/schema/index';
import { eq } from 'drizzle-orm'
import { NotFoundError } from '@/helpers/customErrors'
export const findCustomer = async (tx: DBTransaction, customerId: string) => {
  const customer = await tx.query.customers.findFirst({
    where: eq(customers.customerId, customerId)
  });
  if (!customer) throw new NotFoundError("Customer not found")
  return customer
}