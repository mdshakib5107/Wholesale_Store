import { DBTransaction } from '@/db/types';
import { users } from '@/db/schema/index';
import { eq } from 'drizzle-orm';
interface UserData {
  name: string;
  phone: string;
  address: string;
}

export const createUser = async (tx: DBTransaction, data: UserData) => {

  const isUserExist = await tx.query.users.findFirst({
    where: eq(users.phone, data.phone)
  })
  if (isUserExist) return isUserExist.userId

  const [ insertedUser ] = await tx.insert(users).values(data).returning({ userId: users.userId });
  if (!insertedUser) throw new Error('User could not be inserted');
  return insertedUser.userId
}