import { DBTransaction } from '@/db/types';
import { supplierSlipItems } from '@/db/schema/index';
type Item = {
  size: number,
  quantity: number,
  price: number,
  total: number,
  supplierSlipId: string,
  productId: string
}[]
export const createSlipItem = async (tx: DBTransaction, items: Item) => {

  const insertedSlipItem = await tx.insert(supplierSlipItems).values(items).returning()
  if (insertedSlipItem.length === 0) throw new Error("insert  slip item failed")
}