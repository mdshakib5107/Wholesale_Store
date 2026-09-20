import { DBTransaction } from '@/db/types';
import { users, customers } from '@/db/schema/index';
import { ServerError } from '@/helpers/customErrors';
import { eq } from 'drizzle-orm';
import { createUser } from './createUser'
interface UserData {
  name: string;
  phone: string;
  address: string;
}

export const createCustomer = async (tx: DBTransaction, data: UserData) => {
  try {
    const [ isCustomerExist ] = await tx
      .select({ customerId: customers.customerId })
      .from(customers)
      .innerJoin(users, eq(users.userId, customers.userId))
      .where(eq(users.phone, data.phone));

    if (isCustomerExist) return isCustomerExist.customerId;


    const userId = await createUser(tx, data)
    const [ insertedCustomer ] = await tx
      .insert(customers)
      .values({ userId })
      .returning({ customerId: customers.customerId });
    if (!insertedCustomer) throw new Error('Customer could not be inserted');

    return insertedCustomer.customerId;
  } catch (e: any) {
    console.error('DB error:', e);
    throw new ServerError(e.message);
  }
};