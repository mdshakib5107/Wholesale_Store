import {
  pgTable,
  varchar,
  integer,
  timestamp,
  uuid,
  boolean
} from "drizzle-orm/pg-core";
import { suppliers, products } from "../index";

export const supplierSlips = pgTable("supplier_slip", {
  supplierSlipId: uuid("supplier_slip_id").primaryKey().defaultRandom(),
  totalAmount: integer("total_amount").default(0),
  totalExpense: integer("total_expense").default(0),
  netAmount: integer("net_amount").default(0),
  isCompleted: boolean("is_completed").default(false),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.productId, { onDelete: "cascade" }),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => suppliers.supplierId, { onDelete: "cascade" }),
  status: varchar("status").default("unpaid"),
  createdAt: timestamp("created_at").defaultNow(),
});
