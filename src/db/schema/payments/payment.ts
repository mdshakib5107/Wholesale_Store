import { pgTable, varchar, uuid, integer, timestamp } from 'drizzle-orm/pg-core';

export const payments = pgTable("payments", {
  paymentId: uuid("payment_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  status: varchar("status").default('pending'),
  method: varchar("method").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})