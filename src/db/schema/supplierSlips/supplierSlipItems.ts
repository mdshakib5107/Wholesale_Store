import { pgTable, uuid, timestamp, integer } from 'drizzle-orm/pg-core';
import { products, supplierSlips } from '../index';
export const supplierSlipItems = pgTable("supplier_slip_item", {
  slipItemId: uuid("slip_item_id").primaryKey().defaultRandom(),
  size: integer("size").notNull(),
  quantity: integer("quantity").notNull(),
  price: integer("price").notNull(),
  total: integer("total").notNull(),
  productId: uuid('product_id').notNull().references(() => products.productId),
  supplierSlipId: uuid('supplier_slip_id').notNull().references(() => supplierSlips.supplierSlipId),
  createdAt: timestamp('created_at').defaultNow()
})