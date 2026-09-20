import { DBTransaction } from '@/db/types';
import { bankDetails } from '@/db/schema/index'
type BankDetails = typeof bankDetails.$inferInsert

export const addBankDetails = async (tx: DBTransaction, data: BankDetails) => {

  const [ insertedBankDetails ] = await tx.insert(bankDetails).values(data).returning()
  if (!insertedBankDetails) throw new Error("Inser bank details failed")
}