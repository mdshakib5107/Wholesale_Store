import { db } from '@/db/index';
import { payments, paymentAllocation } from '@/db/schema/index';
import { DepositDTO } from '@/zod/schema';
import { addBankDetails } from './addBankDetails'
import { addDigitalDetails } from './addDigitalDetails'
import { allocateAmount } from '@/controller/orders/helpers/allocateAmount'
import { orderController } from '@/controller/orders/index'
import { stakeholderController } from '@/controller/stakeholder/index'
export const deposits = async (data: DepositDTO) => {


  const discount = data.discount ?? 0
  const payment = db.transaction(async (tx) => {

    const dueOrders = await allocateAmount(tx, { customerId: data.customerId, orderId: data.orderId, amount: data.amount })
    const customerId = data.customerId ?? dueOrders[ 0 ]?.customerId
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


    for (let i = 0; i < dueOrders.length; i++) {

      let order = dueOrders[ i ]
      if (!order) continue
      let lastOrder = i === dueOrders.length - 1
      const [ insertedAllocation ] = await tx.insert(paymentAllocation).values({ orderId: order.orderId, allocatedAmount: order.allocatedAmount, paymentId: insertedPayment.paymentId }).returning()

      if (!insertedAllocation) throw new Error("Inserted allocation failed")

      const appliedDiscount = lastOrder ? discount : 0
      const payAmount = order.allocatedAmount + appliedDiscount
      const orderStatus = payAmount >= order.due ? 'paid' : order.allocatedAmount > 0
        ? 'partial_paid'
        : 'unpaid'

      const due = orderStatus === 'paid' ? 0 : order.due - payAmount
      await orderController.updateOrder(tx, { orderId: order.orderId, orderStatus, due, ...(lastOrder && discount && { discount }) })
    }

    const updatedCustomer = await stakeholderController.updateCustomerDueAmount(tx, { customerId: customerId!, amount: data.amount, ...(data.discount !== undefined && { discount: data.discount }) })
    return updatedCustomer
  })
  return payment
}