import type { Account } from "@/lib/types/account";
import axios from "axios";

export interface CreateAccountData {
  name: string;
  currency: string;
  balance?: number;
}

export interface UpdateAccountData {
  name?: string;
  currency?: string;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const accountsService = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>("/accounts");
    return response.data;
  },

  getAccountById: async (accountId: number): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${accountId}`);
    return response.data;
  },

  createAccount: async (data: CreateAccountData): Promise<Account> => {
    const response = await apiClient.post<Account>("/accounts", data);
    return response.data;
  },

  updateAccount: async (
    accountId: number,
    data: UpdateAccountData,
  ): Promise<Account> => {
    const response = await apiClient.put<Account>(
      `/accounts/${accountId}`,
      data,
    );
    return response.data;
  },

  deleteAccount: async (accountId: number): Promise<void> => {
    await apiClient.delete(`/accounts/${accountId}`);
  },
};
