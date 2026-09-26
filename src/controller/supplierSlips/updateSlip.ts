import { DBTransaction } from "@/db/types";
import { supplierSlips } from '@/db/schema/index';
import { eq } from 'drizzle-orm'
interface UpdateSlipData {
  netAmount: number;
  totalQuantity: number;
  totalExpense: number;
  totalAmount: number;
  isCompleted: boolean;
  due: number;
  status: string
}
export const updateSlip = async (tx: DBTransaction, slipId: string, data: Partial<UpdateSlipData>) => {
  if (Object.keys(data).length === 0) {
    throw new Error("updateSlip called with no fields to update");
  }
  const [ updatedSlip ] = await tx.update(supplierSlips).set(data).where(eq(supplierSlips.supplierSlipId, slipId)).returning()
  if (!updatedSlip) throw new Error("Update slip failed")
  return updatedSlip
}