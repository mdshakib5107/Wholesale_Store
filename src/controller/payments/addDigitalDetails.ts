import { DBTransaction } from '@/db/types';
import { digitalPayment } from '@/db/schema/index'
type DigitalDetails = typeof digitalPayment.$inferInsert

export const addDigitalDetails = async (tx: DBTransaction, data: DigitalDetails) => {
  const [ insertedDigitalDetails ] = await tx.insert(digitalPayment).values(data).returning()
  if (!insertedDigitalDetails) throw new Error("Inser bank details failed")
}