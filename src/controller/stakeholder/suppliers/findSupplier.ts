import { DBTransaction } from '@/db/types';
import { suppliers } from '@/db/schema/index';
import { eq } from 'drizzle-orm'
import { NotFoundError } from '@/helpers/customErrors'
export const findSupplier = async (tx: DBTransaction, supplierId: string) => {
  const supplier = await tx.query.suppliers.findFirst({
    where: eq(suppliers.supplierId, supplierId)
  });
  if (!supplier) throw new NotFoundError("supplier not found")
  return supplier
}