import { DBTransaction } from '@/db/types';
import { users, customers } from '@/db/schema/index';
import { ServerError } from '@/helpers/customErrors';
import { eq } from 'drizzle-orm';
interface UserData {
  name: string, phone: string, address: string
}
export const createCustomer = async (tx: DBTransaction, data: UserData) => {
  try {

    const [ isCustomerExist ] = await tx.select({ customerId: customers.customerId }).from(customers).innerJoin(users, eq(users.userId, customers.userId)).where(eq(users.phone, data.phone))
    if (isCustomerExist) return isCustomerExist.customerId;
    const [ insertedUser ] = await tx.insert(users).values(data).returning({ userId: users.userId })
    if (!insertedUser) throw new Error("User could not inserted")
    const [ insertedCustomer ] = await tx.insert(customers).values({ userId: insertedUser.userId }).returning({ customerId: customers.customerId })
    return insertedCustomer?.customerId


  } catch (e: any) {
    new ServerError(e.message)
  }
}