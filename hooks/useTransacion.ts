import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import { transactionService } from "@/services/transactionService";
import type {
  Transaction,
  CreateTransactionData,
  GetTransactionsFilters,
} from "@/lib/types/transactions";

export const useTransactions = (
  filters?: GetTransactionsFilters,
): UseQueryResult<Transaction[], Error> => {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getTransactions(filters),
  });
};

export const useCreateTransaction = (): UseMutationResult<
  Transaction,
  Error,
  CreateTransactionData,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Error creating transaction:", error);
    },
  });
};

export const useTransaction = {
  useTransactions,
  useCreateTransaction,
};
