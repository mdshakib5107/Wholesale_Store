import { db } from '@/db/index';
import { payments, paymentAllocation } from '@/db/schema/index';
import { addBankDetails } from './addBankDetails'
import { addDigitalDetails } from './addDigitalDetails'
import { SupplierPaymentDTO } from '@/zod/schema';
import { allocateSlipAmount } from '@/controller/supplierSlips/helpers/allocateSlipAmount'
import { supplierSlipController } from '@/controller/supplierSlips/index'
import { supplierController } from '@/controller/stakeholder/suppliers/index'
export const slipPayment = async (data: SupplierPaymentDTO) => {
  const payment = await db.transaction(async (tx) => {
    const dueSlips = await allocateSlipAmount(tx, { supplierId: data.supplierId, amount: data.amount, supplierSlipId: data.supplierSlipId })
    const supplierId = data?.supplierId ?? dueSlips[ 0 ]?.supplierId;
    if (!supplierId) throw new Error("suoplier id is needed")
    /* inset payment */
    const [ insertedPayment ] = await tx.insert(payments).values({ amount: data.amount, status: data.status }).returning()
    if (!insertedPayment) throw new Error("Inserted payment failed")


    for (let item of data.payment) {
      if (item.method === 'bank') {
        await addBankDetails(tx, { ...item.bankDetails, paymentId: insertedPayment.paymentId })
      }

      if (item.method === 'digital') {
        await addDigitalDetails(tx, { ...item.digitalDetails, paymentId: insertedPayment.paymentId })
      }

    }

    /* payment allocation*/
    for (let slip of dueSlips) {
      const [ insertedPaymnetAllocation ] = await tx.insert(paymentAllocation).values({
        paymentId: insertedPayment.paymentId, allocatedAmount: slip.allocatedAmount, supplierSlipId: slip.supplierSlipId
      }).returning()
      if (!insertedPaymnetAllocation) throw new Error("Insert payment allocation failed")
      const status = slip.allocatedAmount >= slip.due ? 'paid' : slip.allocatedAmount > 0 ? 'partial_paid' : "unpaid"

      const due = slip.due - slip.allocatedAmount

      const updatedSlip = await supplierSlipController.updateSlip(tx, slip.supplierSlipId, { due, status })
    }
    /* upate supplier */
    const totalDue = dueSlips.reduce((a, i) => a += Number(i.due), 0)
    const excess = data.amount - totalDue
    console.log(excess);
    const updatedSuppier = await supplierController.updateSupplier(tx, supplierId, { totalDue: totalDue < data.amount ? 0 : -data.amount, ...(excess > 0 && { totalExcess: excess }) })
    return updatedSuppier
  });
  return payment
}