import { pgTable, varchar, uuid, integer, check, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { payments } from './payment'
import { sql } from 'drizzle-orm'
import { cashLedger } from "../cash/index"
export const digitalDirectionType = pgEnum("digital_direction_type", [ 'in', 'out' ])

export const digitalPayment = pgTable("digital_payment_details", {
  digitalPaymentId: uuid("digital_payment_id").primaryKey().defaultRandom(),
  accountName: varchar("account_name").notNull(),

  accountHolder: varchar("account_holder").notNull(),
  accountNo: varchar("account_no").notNull(),
  amount: integer("amount").notNull(),
  direction: digitalDirectionType("direction").notNull(),
  paymentId: uuid("payment_id").references(() => payments.paymentId, { onDelete: "cascade" }),
  cashLedgerId: uuid("cash_ledger_id").references(() => cashLedger.cashLedgerId, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  exactlyOneTarget: check("exactly_one_target_digital", sql`(
(${table.paymentId} IS NOT NULL AND ${table.cashLedgerId} IS NULL)
OR 
(${table.paymentId} IS NULL AND ${table.cashLedgerId} IS NOT NULL)
  )`)
}))