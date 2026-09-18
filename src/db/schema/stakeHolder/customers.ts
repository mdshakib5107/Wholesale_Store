import {
  pgTable,
  
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user";
export const customers = pgTable("customers", {
  customerId: uuid("customer_id").primaryKey().defaultRandom(),
  totalAmount: integer("total_amount").default(0),
  totalDue: integer("total_due").default(0),
  totalInvoice: integer("total_invoice").default(0),
  userId: uuid("user_id")
    .unique()
    .notNull()
    .references(() => users.userId),
  createdAt:timestamp("created_at").defaultNow()
});
