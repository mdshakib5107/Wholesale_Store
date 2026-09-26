
import { DBTransaction } from "@/db/types";
import { suppliers } from "@/db/schema/index";
import { findSupplier } from './findSupplier'
import { eq } from 'drizzle-orm'
type UpdateData = {
  totalAmount: number,
  totalDue: number,
  totalExcess: number
}
export const updateSupplier = async (tx: DBTransaction, supplierId: string, data: Partial<UpdateData>) => {
  const supplier = await findSupplier(tx, supplierId);
  const updatedSupplierData: Record<string, number> = {};
  (Object.keys(data) as (keyof UpdateData)[]).forEach((key) => {
    const value = data[ key ];
    if (value === undefined || value === null) return;
    const currentValue = supplier[ key ] ?? 0;
    updatedSupplierData[ key ] = Number(currentValue) + Number(value)
  });
  if (Object.keys(updatedSupplierData).length === 0) return supplier;

  const [ updatedSupplier ] = await tx.update(suppliers).set(updatedSupplierData).where(eq(suppliers.supplierId, supplierId)).returning()
  if (!updatedSupplier) throw new Error("Update supllier failed")
  return updatedSupplier
}