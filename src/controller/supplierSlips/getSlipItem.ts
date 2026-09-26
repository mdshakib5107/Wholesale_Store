
import { db } from '@/db/index';
import { products, suppliers, users, supplierSlipItems } from '@/db/schema/index';
import { eq, and } from 'drizzle-orm';
import { NotFoundError } from '@/helpers/customErrors'
export interface SupplierData {
  supplierName: string,
  gariNo: number
}
export const getSlipItem = async (data: SupplierData) => {
  const slipItems = await db.transaction(async (tx) => {
    const [ product ] = await tx.select({ productId: products.productId }).from(products).innerJoin(suppliers, eq(products.supplierId, suppliers.supplierId)).innerJoin(users, eq(suppliers.userId, users.userId)).where(
      and(
        eq(users.name, data.supplierName,),
        eq(products.gariNo, data.gariNo)
      )
    );
    if (!product) throw new NotFoundError("Product not exist");
    const items = await tx.query.supplierSlipItems.findMany({
      where: eq(supplierSlipItems.productId, product.productId)
    })
    if (items.length === 0) throw new Error('Items not found')
    return items
  })
  return slipItems
}