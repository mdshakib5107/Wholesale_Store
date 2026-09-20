import { db } from '@/db/index';
import { payments, paymentAllocation } from '@/db/schema/index';
import { PaymentDTO } from '@/zod/schema'
import { orderController } from '@/controller/orders/index';
import { stakeholderController } from '@/controller/stakeholder/index'
//import { orderController } '@/controller/orders/index'
import { calculatePaymentAmount } from '@/helpers/calculatePaymentAmount'
import { addBankDetails } from './addBankDetails'
import { addDigitalDetails } from './addDigitalDetails'
export const payment = async (data: PaymentDTO) => {

  const payment = await db.transaction(async (tx) => {
    const order = await orderController.findOrder(tx, data.orderId)
    if (order.status === 'paid') throw new Error("Order is already paid")
    const payAmount = calculatePaymentAmount({ totalAmount: order.totalAmount, discount: data.discount })
    const orderStatus =
      payAmount <= data.amount ? "paid" :
        payAmount > 0 ? "partial_paid" :
          "unpaid";

    const [ insertedPayment ] = await tx.insert(payments).values({ amount: data.amount, status: data.status }).returning()
    if (!insertedPayment) throw new Error('Insert payment failed')

    for (let item of data.payment) {
      if (item.method === 'bank') {
        await addBankDetails(tx, { ...item.bankDetails, paymentId: insertedPayment.paymentId })
      }

      if (item.method === 'digital') {
        await addDigitalDetails(tx, { ...item.digitalDetails, paymentId: insertedPayment.paymentId })
      }

    }



    const [ insertedPaymentAllocation ] = await tx.insert(paymentAllocation).values({
      allocatedAmount: payAmount,
      orderId: order.orderId,
      paymentId: insertedPayment.paymentId,
    }).returning()

    if (!insertedPaymentAllocation) throw new Error('insert payment allocation failed')

    const due = payAmount - data.amount
    const updateOrder = await orderController.updateOrder(tx, { orderId: order.orderId, orderStatus, due, ...(data.discount !== undefined && { discount: data.discount }) })
    await stakeholderController.updateCustomerDueAmount(tx, order.customerId, data.amount)
    let resData
    if (due) {
      resData = {
        ...updateOrder, due
      }
    } else {
      resData = {
        ...updateOrder,
      }
    }
    return resData
  })
  return payment
};