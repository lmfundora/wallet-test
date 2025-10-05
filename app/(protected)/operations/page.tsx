"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Wallet } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useTransaction } from "@/hooks/useTransacion";
import { useAccounts } from "@/hooks/useAccounts";
import type { GetTransactionsFilters } from "@/lib/types/transactions";
import TransactionCard from "@/components/operations/operationCard";
import SkeletonTransactionCard from "@/components/operations/skeletonOperationCard";

export default function OperationsPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedAccountId, setSelectedAccountId] = useState<
    string | undefined
  >(undefined);

  const { data: accountsList, isLoading: isLoadingAccounts } =
    useAccounts.accounts();

  useEffect(() => {
    if (!selectedAccountId && accountsList && accountsList.length > 0) {
      setSelectedAccountId(String(accountsList[0].id));
    }
  }, [accountsList, selectedAccountId]);

  const filters: GetTransactionsFilters = {
    startDate: startDate?.toISOString(),
    endDate: endDate?.toISOString(),
    accountId: Number(selectedAccountId),
  };

  const {
    data: transactionsList,
    isLoading: isLoadingTransactions,
    error,
    refetch,
  } = useTransaction.useTransactions(filters);

  const isLoading = isLoadingAccounts || isLoadingTransactions;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Error al cargar las operaciones: {error.message}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operaciones</h1>
        </div>

        <Button asChild>
          <Link href="/operations/new">
            <Plus className="w-4 h-4 mr-1" />
            Nueva
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar Operaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Select
              onValueChange={setSelectedAccountId}
              value={selectedAccountId}
              disabled={isLoadingAccounts}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una cuenta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Cuentas</SelectItem>
                {isLoadingAccounts ? (
                  <SelectItem value="loading" disabled>
                    Cargando cuentas...
                  </SelectItem>
                ) : (
                  accountsList?.map((account) => (
                    <SelectItem key={account.id} value={String(account.id)}>
                      {account.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    <p>{startDate?.toLocaleDateString()}</p>
                  ) : (
                    <span>Fecha Inicio</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>

            {/* End Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? (
                    <p>{endDate.toLocaleDateString()}</p>
                  ) : (
                    <span>Fecha Fin</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>

            {(startDate || endDate || selectedAccountId) && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStartDate(undefined);
                  setEndDate(undefined);
                  setSelectedAccountId("all");
                }}
              >
                Limpiar Filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonTransactionCard key={i} />
          ))}
        </div>
      )}

      {transactionsList && transactionsList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-[320px] md:max-h-[calc(100vh-100px)] overflow-y-auto">
          {transactionsList.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              account={accountsList?.find(
                (account) => account.id.toString() === selectedAccountId,
              )}
            />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No tienes operaciones
            </h3>
          </div>
        )
      )}
    </div>
  );
}
