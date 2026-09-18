import { pgTable, varchar, uuid, integer, timestamp, pgEnum, check } from 'drizzle-orm/pg-core';
import { payments } from './payment'
import { sql } from 'drizzle-orm'
import { cashLedger } from "../cash/index"
export const bankDirectionType = pgEnum("bank_direction_type", [ 'in', 'out' ])
export const bankDetails = pgTable("bank_details", {
  bankDetailsId: uuid("bank_details_id").primaryKey().defaultRandom(),
  bankName: varchar("bank_name").notNull(),
  branchName: varchar("branch_name").notNull(),
  accountHolder: varchar("account_holder").notNull(),
  accountNo: varchar("account_no").notNull(),
  amount: integer("amount").notNull(),
  direction: bankDirectionType("direction").notNull(),
  paymentId: uuid("payment_id").references(() => payments.paymentId),
  cashLedgerId: uuid("cash_ledger_id").references(() => cashLedger.cashLedgerId),
  createdAt: timestamp("created_at").defaultNow()
}, (table) => ({
  exactlyOneTarget: check("exactly_one_target", sql`(
(${table.paymentId} IS NOT NULL AND ${table.cashLedgerId} IS NULL)
OR 
(${table.paymentId} IS NULL AND ${table.cashLedgerId} IS NOT NULL)
  )`)
}))