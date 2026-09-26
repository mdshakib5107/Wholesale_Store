import { DBTransaction } from "@/db/types";
import { supplierExpense } from '@/db/schema/index';
type SupplierExpenseData = typeof supplierExpense.$inferInsert;
export const createSupplierExpense = async (tx: DBTransaction, data: SupplierExpenseData) => {
  const [ insertedExpense ] = await tx.insert(supplierExpense).values(data).returning({
    trackRent: supplierExpense.trackRent,
    commission: supplierExpense.commission,
    laborFare: supplierExpense.laborFare,
    mosque: supplierExpense.mosque,
    communityFare: supplierExpense.communityFare,
    scaleFare: supplierExpense.scaleFare,

  });
  if (!insertedExpense) throw new Error("Could not insert supplier expense")
  return insertedExpense
}