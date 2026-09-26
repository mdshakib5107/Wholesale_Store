import { DBTransaction } from '@/db/types'
import { supplierSlips } from '@/db/schema/index'
import { NotFoundError, BadRequestError } from '@/helpers/customErrors'
import { and, eq, ne, asc } from 'drizzle-orm'
export const getSupplierSlips = async (tx: DBTransaction, supplierId: string | undefined) => {
  if (!supplierId) throw new BadRequestError("Supplier id is required")
  const slips = await tx.query.supplierSlips.findMany({
    where: and(

      eq(supplierSlips.supplierId, supplierId),
      and(ne(supplierSlips.status, 'paid'), eq(supplierSlips.isCompleted, true))
    ),
    orderBy: asc(supplierSlips.createdAt)
  })
  if (slips.length == 0) throw new NotFoundError(`Slip for supplier : ${supplierId} not found`)
  return slips
}