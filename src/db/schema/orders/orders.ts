import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { customers } from "../index";
export const orders = pgTable("orders", {
  orderId: uuid("order_id").primaryKey().defaultRandom(),
  totalAmount: integer("total_amount").notNull().default(0),
  discount: integer("discount").default(0),
  status: varchar("status").default("unpaid"),
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.customerId),
  createdAt: timestamp("created_at").defaultNow(),
});
