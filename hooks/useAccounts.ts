import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  accountsService,
  type CreateAccountData,
  type UpdateAccountData,
} from "@/services/accountsService";
import type { Account } from "@/lib/types/account";

export const accounts = (): UseQueryResult<Account[], Error> => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountsService.getAccounts,
  });
};

export const accountById = (
  accountId: number,
): UseQueryResult<Account, Error> => {
  return useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => accountsService.getAccountById(accountId),
    enabled: !!accountId,
  });
};

export const createAccount = (): UseMutationResult<
  Account,
  Error,
  CreateAccountData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsService.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error creating account:", error);
    },
  });
};

// Hook to update an existing account
export const updateAccount = (): UseMutationResult<
  Account,
  Error,
  { accountId: number; data: UpdateAccountData },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, data }) =>
      accountsService.updateAccount(accountId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error updating account:", error);
    },
  });
};

// Hook to delete an account
export const deleteAccount = (): UseMutationResult<
  void,
  Error,
  number,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountsService.deleteAccount,
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      console.error("Error deleting account:", error);
    },
  });
};

export const useAccounts = {
  accounts,
  accountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
