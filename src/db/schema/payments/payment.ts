import { pgTable, varchar, uuid, integer, timestamp } from 'drizzle-orm/pg-core';

export const payments = pgTable("payments", {
  paymentId: uuid("payment_id").primaryKey().defaultRandom(),
  amount: integer("amount").notNull(),
  status: varchar("status").default('pending'),

  createdAt: timestamp("created_at").defaultNow(),
})