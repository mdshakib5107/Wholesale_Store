import {
  pgTable,
  uuid,
  varchar,

} from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  address: varchar("address").notNull(),
  phone: varchar("phone").unique().notNull()
});
