import { pgTable, text, uuid, integer, timestamp, } from 'drizzle-orm/pg-core';
import { cashLedger } from "./cashLedger"
export const variableCosts = pgTable("variable_cost", {
  variableCostId: uuid("variable_cost_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  cashLedgerId: uuid("cash_ledger_id").notNull().references(() => cashLedger.cashLedgerId),
  createdAt: timestamp("created_at").defaultNow()
})