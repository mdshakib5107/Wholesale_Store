import { pgTable, integer, uuid } from 'drizzle-orm/pg-core';
import { supplierSlips } from './supplierSlips';
export const supplierExpense = pgTable("supplier_expense", {
  supplierExpenseId: uuid("supplier_expense_id").primaryKey().defaultRandom(),
  trackRent: integer("truck_rent"),
  commission: integer("commission"),
  laborFare: integer("labor_fare"),
  mosque: integer("mosque").default(50),
  communityFare: integer("community_fare").default(100),
  scaleFare: integer("scale_fare"),
  supplierSlipId: uuid("supplier_slip_id").notNull().unique().references(() => supplierSlips.supplierSlipId)
}) 