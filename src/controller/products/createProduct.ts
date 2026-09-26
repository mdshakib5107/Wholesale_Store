import { db } from '@/db/index';
import { eq, and } from 'drizzle-orm'
import { suppliers, users, products, supplierSlips } from '@/db/schema/index';
import { stakeholderController } from '@/controller/stakeholder/index'
import { ProductDTO } from '@/zods/schema'
import { BadRequestError } from '@/helpers/customErrors'
export const createProducts = async (data: ProductDTO) => {


  const productData = await db.transaction(async (tx) => {

    const [ isProductExist ] = await tx.select({ productId: products.productId }).from(products).innerJoin(suppliers, eq(products.supplierId, suppliers.supplierId)).innerJoin(users, eq(suppliers.userId, users.userId)).where(and(eq(users.phone, data.phone), eq(products.gariNo, data.gariNo)))
    if (isProductExist?.productId) throw new BadRequestError(`Product already exist.ProductId is:  ${isProductExist.productId}`)


    // if product not existed 
    const supplierId = await stakeholderController.createSupplier({ name: data.supplierName, phone: data.phone, address: data.address })

    const [ insertProduct ] = await tx.insert(products).values({ productName: data.productName, gariNo: data.gariNo, supplierId: supplierId! }).returning()
    if (!insertProduct) throw new Error('Insert product failed')
    const [ supplierSlip ] = await tx.insert(supplierSlips).values({ supplierId: supplierId!, productId: insertProduct.productId! }).returning()
    if (!supplierSlip) throw new Error('Insert supplierSlip failed')
    return insertProduct
  })
  return productData
}


