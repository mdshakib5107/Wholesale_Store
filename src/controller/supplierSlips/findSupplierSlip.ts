import { DBTransaction } from '@/db/types'
import { supplierSlips } from '@/db/schema/index'
import { NotFoundError } from '@/helpers/customErrors'
import { and, eq } from 'drizzle-orm'
type Data = {
  tx: DBTransaction,
  productId?: string | undefined,
  supplierSlipId?: string | undefined,
}
export const findSupplierSlip = async (data: Data) => {
  if (data.productId) {
    const [ supplierSlip ] = await data.tx.select().from(supplierSlips).where(eq(supplierSlips.productId, data.productId))



    if (!supplierSlip) throw new NotFoundError("supplierSlip not found")

    return supplierSlip
  }
  if (data.supplierSlipId) {
    const [ supplierSlip ] = await data.tx.select().from(supplierSlips).where(
      and(
        eq(supplierSlips.supplierSlipId, data.supplierSlipId),
        eq(supplierSlips.isCompleted, true)
      )
    )



    if (!supplierSlip) throw new NotFoundError("supplierSlip not found")

    return supplierSlip
  }
}
