import { users, customers, suppliers, } from "./stakeHolder/index";

import { orders, orderItems, } from './orders/index'
import { supplierSlips, supplierSlipItems, supplierExpense } from './supplierSlips/index'
import { products } from './products'
import { relations } from "drizzle-orm";
import { cashLedger, variableCosts, fixedCosts, deposits } from './cash/index'
import { payments, bankDetails, digitalPayment, paymentAllocation } from './payments/index'

export const userRelation = relations(users, ({ one }) => ({
  customer: one(customers, {
    fields: [ users.userId ],
    references: [ customers.userId ],
  }),
  supplier: one(suppliers, {
    fields: [ users.userId ],
    references: [ suppliers.userId ],
  }),
}));


export const customerRelation = relations(customers, ({ one, many }) => ({
  user: one(users, {
    fields: [ customers.userId ],
    references: [ users.userId ],
  }),
  orders: many(orders)
}));


export const suppliersRelation = relations(suppliers, ({ one, many }) => ({
  user: one(users, {
    fields: [ suppliers.userId ],
    references: [ users.userId ],
  }),
  products: many(products),
  supplierSlips: many(supplierSlips)
}));


export const ordersRelation = relations(orders, ({ many, one }) => ({
  orderItems: many(orderItems),
  customer: one(customers, {
    fields: [ orders.customerId ],
    references: [ customers.customerId ]
  })
}))


export const orderItemsRelation = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [ orderItems.orderId ],
    references: [ orders.orderId ],
  })
}))


export const supplierSlipsRelation = relations(supplierSlips, ({ many, one }) => ({
  slipItems: many(supplierSlipItems),
  supplier: one(suppliers, {
    fields: [ supplierSlips.supplierId ],
    references: [ suppliers.supplierId ],
  }),
  supplierExpense: one(supplierExpense, {
    fields: [ supplierSlips.supplierSlipId ],
    references: [ supplierExpense.supplierSlipId ],
  })
}))


export const supplierSlipItemsRelation = relations(supplierSlipItems, ({ one }) => ({
  supplierSlip: one(supplierSlips, {
    fields: [ supplierSlipItems.supplierSlipId ],
    references: [ supplierSlips.supplierSlipId ],
  }),
  product: one(products, {
    fields: [ supplierSlipItems.productId ],
    references: [ products.productId ],
  }),

}))
export const supplierExpenseRelation = relations(supplierExpense, ({ one }) => ({
  supplierSlip: one(supplierSlips, {
    fields: [ supplierExpense.supplierSlipId ],
    references: [ supplierSlips.supplierSlipId ],
  }),
}))


export const productsRelation = relations(products, ({ one, many }) => ({
  supplier: one(suppliers, {
    fields: [ products.supplierId ],
    references: [ suppliers.supplierId ],
  }),
  slipItems: many(supplierSlipItems)
}))

export const paymentRelation = relations(payments, ({ many, one }) => ({
  paymentAllocations: many(paymentAllocation),
  deposit: one(deposits, {
    fields: [ payments.paymentId ],
    references: [ deposits.paymentId ],
  })
}))

export const paymentAllocationRelation = relations(paymentAllocation, ({ one }) => ({
  payment: one(payments, {
    fields: [ paymentAllocation.paymentId ],
    references: [ payments.paymentId ]
  })
}))

export const cashLedgerRelation = relations(cashLedger, ({ many }) => ({
  bankDetails: many(bankDetails),
  digitalPayments: many(digitalPayment),
  fixedCosts: many(fixedCosts),
  variableCosts: many(variableCosts),
}))
export const bankDetailsRelation = relations(bankDetails, ({ one }) => ({
  payment: one(payments, {
    fields: [ bankDetails.paymentId ],
    references: [ payments.paymentId ]
  }),
  cashLedger: one(cashLedger, {
    fields: [ bankDetails.cashLedgerId ],
    references: [ cashLedger.cashLedgerId ]
  }),
}))
export const digitalPaymentRelation = relations(digitalPayment, ({ one }) => ({
  payment: one(payments, {
    fields: [ digitalPayment.paymentId ],
    references: [ payments.paymentId ]
  }),
  cashLedger: one(cashLedger, {
    fields: [ digitalPayment.cashLedgerId ],
    references: [ cashLedger.cashLedgerId ]
  }),
}))
export const depositsRelation = relations(deposits, ({ one }) => ({
  payment: one(payments, {
    fields: [ deposits.paymentId ],
    references: [ payments.paymentId ],
  })
}))
export const fixedCostsRelation = relations(fixedCosts, ({ one }) => ({
  cashLedger: one(cashLedger, {
    fields: [ fixedCosts.cashLedgerId ],
    references: [ cashLedger.cashLedgerId ],
  })
}))
export const variableCostsRelation = relations(variableCosts, ({ one }) => ({
  cashLedger: one(cashLedger, {
    fields: [ variableCosts.cashLedgerId ],
    references: [ cashLedger.cashLedgerId ],
  })
}))
