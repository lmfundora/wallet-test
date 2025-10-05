import { InferSelectModel } from "drizzle-orm";
import { transactions } from "@/lib/db/schema/accounts";

export type Transaction = InferSelectModel<typeof transactions>;

export interface CreateTransactionData {
  accountId: number;
  type: "deposit" | "withdrawal";
  amount: string;
  description?: string;
}

export interface GetTransactionsFilters {
  startDate?: string;
  endDate?: string;
  accountId?: number;
}
