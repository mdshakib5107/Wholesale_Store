import { pgTable, varchar, uuid, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

//import { sql } from 'drizzle-orm';
export const cashLedgerDirection = pgEnum("cash_ledger_direction", [ "in", "out" ])
export const cashLedger = pgTable('cash_ledger', {
  cashLedgerId: uuid("cash_ledger_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  direction: cashLedgerDirection("direction").notNull(),
  status: varchar("status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
},)
// FIXME heelo