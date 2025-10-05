"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccounts } from "@/hooks/useAccounts";
import { useTransaction } from "@/hooks/useTransacion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import AccountCard from "@/components/accounts/accountCard";
import TransactionCard from "@/components/operations/operationCard";
import SkeletonTransactionCard from "@/components/operations/skeletonOperationCard";

export default function DashboardPage() {
  const {
    data: accountsList,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useAccounts.accounts();
  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >(undefined);

  // Set default selected account to the first one when accounts are loaded
  useEffect(() => {
    if (
      !selectedAccountId &&
      accountsList &&
      accountsList.length > 0 &&
      !isLoadingAccounts
    ) {
      setSelectedAccountId(String(accountsList[0].id));
    }
  }, [accountsList, selectedAccountId, isLoadingAccounts]);

  const selectedAccount = accountsList?.find(
    (account) => String(account.id) === selectedAccountId,
  );

  const {
    data: transactionsList,
    isLoading: isLoadingTransactions,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransaction.useTransactions({
    accountId: selectedAccountId ? Number(selectedAccountId) : undefined,
  });

  const isLoading = isLoadingAccounts || isLoadingTransactions;
  const error = accountsError || transactionsError;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">
            Error al cargar datos: {error.message}
          </p>
          <Button
            onClick={() => {
              useAccounts.accounts().refetch();
              refetchTransactions();
            }}
            variant="outline"
          >
            Intentar de nuevo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h3 className="text-3xl font-bold tracking-tight mb-2 md:mb-5">
        Dashboard
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <Card className="pt-5">
          <CardHeader>
            <CardTitle>Seleccionar Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={setSelectedAccountId}
              value={selectedAccountId}
              disabled={
                isLoadingAccounts || !accountsList || accountsList.length === 0
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingAccounts ? (
                  <SelectItem value="loading" disabled>
                    Cargando cuentas...
                  </SelectItem>
                ) : accountsList && accountsList.length > 0 ? (
                  accountsList.map((account) => (
                    <SelectItem key={account.id} value={String(account.id)}>
                      {account.name} ({account.currency})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-accounts" disabled>
                    No hay cuentas disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <div className="my-2"></div>

            {isLoadingAccounts && <Skeleton className="h-[150px] w-full" />}
            {!isLoadingAccounts && selectedAccount && (
              <AccountCard account={selectedAccount} />
            )}
            {!isLoadingAccounts &&
              accountsList &&
              accountsList.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-muted-foreground">
                    No tienes cuentas creadas.
                    <Button asChild variant="link" className="px-1">
                      <Link href="/accounts/new">Crear una ahora.</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Operaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[250px] md:max-h-[calc(100vh-250px)] overflow-y-auto">
            {isLoadingTransactions && (
              <div className="grid gap-4">
                {[0, 1, 2].map((i) => (
                  <SkeletonTransactionCard key={i} />
                ))}
              </div>
            )}

            {!isLoadingTransactions &&
            transactionsList &&
            transactionsList.length > 0 ? (
              <div className="grid gap-4">
                {transactionsList.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    account={selectedAccount}
                  />
                ))}
              </div>
            ) : (
              !isLoadingTransactions &&
              selectedAccountId && (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No hay operaciones para esta cuenta.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
