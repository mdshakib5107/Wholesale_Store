import { DBTransaction } from '@/db/types';
import { customers } from '@/db/schema/index';
import { findCustomer } from "./findCustomer"
import { eq } from 'drizzle-orm'
type UpdatedData = {
  customerId: string, amount: number,
  discount?: number
}
export const updateCustomerDueAmount = async (tx: DBTransaction, data: UpdatedData) => {
  if (data.amount < 0) throw new Error('Amount should be positive')
  const customer = await findCustomer(tx, data.customerId)

  let updatedDueAmount: number
  if (data.discount) {
    updatedDueAmount = customer.totalDue! - (data.amount + data.discount)
  } else {
    updatedDueAmount = customer.totalDue! - data.amount
  }

  if (updatedDueAmount < 0) throw new Error("Due amount could not be negative")
  const [ updatedCustomer ] = await tx.update(customers).set({ totalDue: updatedDueAmount }).where(eq(customers.customerId, data.customerId)).returning()
  if (!updatedCustomer) throw new Error('Update customer failed')
  return updatedCustomer
}