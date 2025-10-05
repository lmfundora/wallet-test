import {
  pgTable,
  text,
  timestamp,
  decimal,
  pgEnum,
  serial,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema"; // Assuming auth-schema.ts is in the same directory

// Optional: Define an enum for transaction types for better data integrity
export const transactionTypeEnum = pgEnum("transaction_type", [
  "deposit",
  "withdrawal",
]);

export const monetaryAccounts = pgTable("monetary_accounts", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  currency: text("currency").notNull().default("USD"),
  balance: decimal("balance", { precision: 19, scale: 4 })
    .notNull()
    .default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  accountId: integer("account_id")
    .notNull()
    .references(() => monetaryAccounts.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 19, scale: 4 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
