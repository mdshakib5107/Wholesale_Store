import { db } from '@/db/index';
import { payments, paymentAllocation } from '@/db/schema/index';
import { PaymentDTO } from '@/zod/schema'
import { orderController } from '@/controller/orders/index';
//import { orderController } '@/controller/orders/index'
import { calculatePaymentAmount } from '@/helpers/calculatePaymentAmount'
import { addBankDetails } from './addBankDetails'
import { addDigitalDetails } from './addDigitalDetails'
export const payment = async (data: PaymentDTO) => {

  const payment = await db.transaction(async (tx) => {
    const order = await orderController.findOrder(tx, data.orderId)
    const payAmount = calculatePaymentAmount({ totalAmount: order.totalAmount, discount: data.discount })
    const orderStatus =
      payAmount <= data.amount ? "paid" :
        payAmount > 0 ? "partial_paid" :
          "unpaid";

    const [ insertedPayment ] = await tx.insert(payments).values({ amount: data.amount, status: data.status, method: data.method }).returning()
    if (!insertedPayment) throw new Error('Insert payment failed')
    if (data.method === 'bank') {
      await addBankDetails(tx, { ...data.bankDetails, paymentId: insertedPayment.paymentId })
    }

    if (data.method === 'digital') {
      await addDigitalDetails(tx, { ...data.digitalDetails, paymentId: insertedPayment.paymentId })
    }

    const [ insertedPaymentAllocation ] = await tx.insert(paymentAllocation).values({
      allocatedAmount: payAmount,
      orderId: order.orderId,
      paymentId: insertedPayment.paymentId,
    }).returning()

    if (!insertedPaymentAllocation) throw new Error('insert payment allocation failed')

    const updateOrder = await orderController.updateOrder(tx, order.orderId, orderStatus)
    const due = payAmount - data.amount
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