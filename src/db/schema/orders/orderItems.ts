import { pgTable, varchar, integer, uuid } from "drizzle-orm/pg-core";
import { orders, products } from "../index";

export const orderItems = pgTable("order_items", {
  orderItemId: uuid("order_item_id").primaryKey().defaultRandom(),
  size: integer("size").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  total: integer("total").notNull(),
  productId: uuid()
    .notNull()
    .references(() => products.productId),
  orderId: uuid()
    .notNull()
    .references(() => orders.orderId),
});
