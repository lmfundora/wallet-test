import axios from "axios";
import {
  Transaction,
  CreateTransactionData,
  GetTransactionsFilters,
} from "@/lib/types/transactions";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const transactionService = {
  getTransactions: async (
    filters?: GetTransactionsFilters,
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters?.endDate) {
      params.append("endDate", filters.endDate);
    }
    if (filters?.accountId) {
      params.append("accountId", String(filters.accountId));
    }

    const response = await apiClient.get<Transaction[]>("/transactions", {
      params,
    });
    return response.data;
  },

  createTransaction: async (
    data: CreateTransactionData,
  ): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>("/transactions", data);
    return response.data;
  },
};
