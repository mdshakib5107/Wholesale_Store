import { pgTable, varchar, uuid, integer, check, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { orders } from '../orders/index'
import { supplierSlips } from '../supplierSlips/index';
import { payments } from './payment';

export const paymentAllocation = pgTable("payment_allocation", {
  paymentAllocationId: uuid('payment_allocation_id').primaryKey().defaultRandom(),
  allocatedAmount: integer("allocated_amount").notNull(),
  orderId: uuid("order_id").references(() => orders.orderId, { onDelete: "cascade" }),
  supplierSlipId: uuid("supplier_slip_id").references(() => supplierSlips.supplierSlipId, { onDelete: "cascade" }),
  paymentId: uuid("payment_id").notNull().references(() => payments.paymentId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  checkExactlyOne: check("chk_exactly_one_id", sql`
  (
(${table.orderId} IS NOT NULL AND ${table.supplierSlipId} IS NULL)
OR
(${table.orderId} IS NULL AND ${table.supplierSlipId} IS NOT NULL)
  )
  `
  )
}))