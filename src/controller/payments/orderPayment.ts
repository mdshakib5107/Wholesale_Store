
import { payments, orders, paymentAllocation } from '@/db/schema/index';
import { stakeholderController } from '@/controller/stakeholder/index'
import { calculatePaymentAmount } from '@/helpers/calculatePaymentAmount'
import { orderController } from '@/controller/orders/index';

import { DBTransaction } from '@/db/types';


type Order = typeof orders.$inferSelect
type Data = {
  amount: number,
  discount: number | undefined,
  paymentId: string
}




export const orderPayment = async (tx: DBTransaction, order: Order, data: Data) => {
  const payAmount = calculatePaymentAmount({ totalAmount: order.totalAmount, discount: data.discount })
  const orderStatus =
    payAmount <= data.amount ? "paid" :
      payAmount > 0 ? "partial_paid" :
        "unpaid";

  const [ insertedPaymentAllocation ] = await tx.insert(paymentAllocation).values({
    allocatedAmount: data.amount,
    orderId: order.orderId,
    paymentId: data.paymentId,
  }).returning()

  if (!insertedPaymentAllocation) throw new Error('insert payment allocation failed')
  const offset = Math.min(payAmount, data.amount)
  const due = payAmount - offset
  const updateOrder = await orderController.updateOrder(tx, { orderId: order.orderId, orderStatus, due, ...(data.discount !== undefined && { discount: data.discount }) })
  await stakeholderController.updateCustomerDueAmount(tx, { customerId: order.customerId, amount: data.amount, ...(data.discount !== undefined && { discount: data.discount }) })

  return updateOrder


}