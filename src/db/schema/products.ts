import {
  pgTable,
  varchar,
  integer,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
import { suppliers } from "./index";
export const products = pgTable("products", {
  productId: uuid("product_id").primaryKey().defaultRandom(),
  productName: varchar("name").notNull(),
  gariNo: integer("gari_no").notNull(),
  supplierId: uuid("supplier_id")
    .notNull()
    .references(() => suppliers.supplierId),
  createdAt: timestamp("created_at").defaultNow(),
});
