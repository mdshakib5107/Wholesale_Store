import { db } from '@/db/index';
import { users, suppliers } from '@/db/schema/index';
import { ServerError } from '@/helpers/customErrors';
import { eq } from 'drizzle-orm';
interface UserData {
  name: string, phone: string, address: string
}
export const createSupplier = async (data: UserData) => {
  try {
    const supplierId = await db.transaction(async (tx) => {
      const [ isSupplierExist ] = await tx.select({ supplierId: suppliers.supplierId }).from(suppliers).innerJoin(users, eq(users.userId, suppliers.userId)).where(eq(users.phone, data.phone))
      if (isSupplierExist) return isSupplierExist.supplierId;
      const [ insertedUser ] = await tx.insert(users).values(data).returning({ userId: users.userId })
      if (!insertedUser) throw new Error("User could not inserted")
      const [ insertedSupplier ] = await tx.insert(suppliers).values({ userId: insertedUser.userId }).returning({ supplierId: suppliers.supplierId })
      return insertedSupplier?.supplierId
    })
    return supplierId
  } catch (e: any) {
    new ServerError(e.message)
  }
}