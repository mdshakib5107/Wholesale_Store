import { DBTransaction } from '@/db/types'
import { supplierSlips } from '@/db/schema/index'
import { NotFoundError } from '@/helpers/customErrors'
import { eq } from 'drizzle-orm'
export const findSupplierSlip = async (tx: DBTransaction, productId: string) => {
  const [ supplierSlip ] = await tx.select({ supplierSlipId: supplierSlips.supplierSlipId }).from(supplierSlips).where(eq(supplierSlips.productId, productId))


  //console.log(supplierSlip);
  if (!supplierSlip) throw new NotFoundError("supplierSlip not found")

  return supplierSlip.supplierSlipId
}
