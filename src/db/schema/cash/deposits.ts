import { pgTable, uuid, integer, timestamp, } from 'drizzle-orm/pg-core';
import { customers } from '../stakeHolder/index'
import { payments } from '../payments/index'

//  TODO the function 

export const deposits = pgTable("deposits", {
  depositId: uuid("deposit_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  customerId: uuid("customer_id").references(() => customers.customerId, { onDelete: 'restrict' }),
  paymentId: uuid("payment_id").references(() => payments.paymentId, { onDelete: 'restrict' }),
  createdAt: timestamp("created_at").defaultNow()
})
// FIXME 