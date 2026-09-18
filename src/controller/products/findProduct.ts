import { db } from '@/db/index'
import { products, suppliers, users } from '@/db/schema/index';
import { eq, and } from 'drizzle-orm'
import { NotFoundError } from '@/helpers/customErrors'
export const findProduct = async (
  { supplierName, gariNo }: { supplierName: string, gariNo: number }) => {
  const [ product ] = await db.select({ productId: products.productId }).from(products).innerJoin(suppliers, eq(products.supplierId, suppliers.supplierId)).innerJoin(users, eq(suppliers.userId, users.userId)).where(and(eq(products.gariNo, gariNo), eq(users.name, supplierName)))
  if (!product) throw new NotFoundError('product not found')
  return product.productId
}