import { db } from '@/db/index';

import { NotFoundError } from '@/helpers/customErrors'
export const getAllCustomers = async () => {
  const customers = await db.query.customers.findMany({
    with: {
      user: true
    }
  });
  if (customers.length === 0) throw new NotFoundError("Customer not found")
  return customers
}