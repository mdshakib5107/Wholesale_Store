import {
  pgTable,
  
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user";
export const suppliers = pgTable("suppliers", {
  supplierId: uuid("supplier_id").primaryKey().defaultRandom(),
  totalAmount: integer("total_amount").default(0),
  totalDue: integer("total_due").default(0),
  totalExcess: integer("total_excess").default(0),
  totalSlips: integer("total_slips").default(0),
  userId: uuid("user_id")
    .unique()
    .notNull()
    .references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow(),
});
