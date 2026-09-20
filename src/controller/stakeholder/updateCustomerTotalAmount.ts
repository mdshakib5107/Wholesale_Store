import { DBTransaction } from '@/db/types';
import { customers } from '@/db/schema/index';
import { findCustomer } from "./findCustomer"
import { eq } from 'drizzle-orm'
export const updateCustomerTotalAmount = async (tx: DBTransaction, customerId: string, amount: number) => {
  if (amount < 0) throw new Error('Amount should be positive')
  const customer = await findCustomer(tx, customerId)
  const updatedTotalAmount = customer.totalAmount! + amount
  const updatedDueAmount = customer.totalDue! + amount
  const [ updatedCustomer ] = await tx.update(customers).set({ totalAmount: updatedTotalAmount, totalDue: updatedDueAmount }).where(eq(customers.customerId, customerId)).returning()
  if (!updatedCustomer) throw new Error('Update customer failed')
  return updatedCustomer
}