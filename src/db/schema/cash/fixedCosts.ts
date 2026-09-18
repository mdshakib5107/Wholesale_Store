import { pgTable, text, uuid, integer, timestamp, } from 'drizzle-orm/pg-core';
import { cashLedger } from "./cashLedger"
export const fixedCosts = pgTable("fixed_cost", {
  fixedCostId: uuid("fixed_cost_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  cashLedgerId: uuid("cash_ledger_id").notNull().references(() => cashLedger.cashLedgerId),
  createdAt: timestamp("created_at").defaultNow()
})