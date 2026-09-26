import { db } from '@/db/index';
import { payments } from '@/db/schema/index';
import { PaymentDTO } from '@/zod/schema'
import { orderPayment } from './orderPayment'
import { orderController } from '@/controller/orders/index'

import { addBankDetails } from './addBankDetails'
import { addDigitalDetails } from './addDigitalDetails'
export const payment = async (data: PaymentDTO) => {

  const payment = await db.transaction(async (tx) => {

    const order = await orderController.findOrder(tx, data.orderId)
    if (order.status === 'paid') throw new Error("Order is already paid")


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

    const resData = await orderPayment(tx, order, { amount: data.amount, discount: data.discount, paymentId: insertedPayment.paymentId })
    return resData

  })
  return payment
};