import { db } from '@/db/index';
import { supplierSlipItems, supplierSlips } from '@/db/schema/index';
import { sum, eq } from 'drizzle-orm';
import { productController } from '@/controller/products/index'
import { SupplierSlipDTO } from '@/zods/schema';
import { findSupplierSlip } from './findSupplierSlip'
import { createSupplierExpense } from './supplierExpense'
import { supplierController } from '@/controller/stakeholder/suppliers/index'
import { updateSlip } from './updateSlip'



export const prepareSlip = async (data: SupplierSlipDTO) => {
  const { supplierInfo: { supplierName, gariNo }, expenses } = data
  const slips = await db.transaction(async (tx) => {
    const productId = await productController.findProduct({ supplierName, gariNo })
    const supplierSlip = await findSupplierSlip({ tx, productId })
    const slipId = supplierSlip?.supplierSlipId
    if (supplierSlip?.isCompleted == true) throw new Error("supplierSlip Already complete");
    if (!slipId) throw new Error('Supplier slip not found')

    /* get slip item total*/
    const result = await tx
      .select({
        total: sum(supplierSlipItems.total),
        totalQuantity: sum(supplierSlipItems.quantity),
      })
      .from(supplierSlipItems)
      .where(eq(supplierSlipItems.supplierSlipId, slipId));

    const { total, totalQuantity } = result[ 0 ] ?? { total: null, totalQuantity: null };

    const totalAmount = total ? Number(total) : 0;
    const totalQty = totalQuantity ? Number(totalQuantity) : 0;
    const commission = totalAmount * (expenses.commission / 100)
    const laborFare = totalQty * (expenses.laborFare / 100)

    const supplierExpenses = await createSupplierExpense(tx, { ...expenses, commission, laborFare, supplierSlipId: slipId })

    const totalExpense = Object.values(supplierExpenses).reduce((acc: number, item) => {
      if (item !== null && item !== undefined) {
        acc += Number(item)
      }
      return acc
    }, 0)

    if (totalExpense === null || totalExpense === undefined) {
      throw new Error('totalExpense is null')
    }

    const netAmount = totalAmount - totalExpense
    const updatedSlip = await updateSlip(tx, slipId, {
      totalQuantity: totalQty, totalAmount, totalExpense, netAmount, isCompleted: true, due: netAmount
    })

    await supplierController.updateSupplier(tx, updatedSlip.supplierId, {
      ...(updatedSlip.netAmount !== undefined && updatedSlip.netAmount && {
        totalAmount: updatedSlip.netAmount,
        totalDue: updatedSlip.netAmount
      })
    })

    return updatedSlip
  })
  return slips
}