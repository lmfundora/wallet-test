"use client";

import { Wallet, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { accounts } from "@/hooks/useAccounts";
import { SkeletonCard } from "@/components/accounts/skeleton";
import AccountCard from "@/components/accounts/accountCard";

export default function AccountsPage() {
  const { data: accountsList, isLoading, error, refetch } = accounts();

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive mb-4">
              Error al cargar las cuentas: {error.message}
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
          <h1 className="text-3xl font-bold tracking-tight">Cuentas</h1>
        </div>

        <Button asChild>
          <Link href="/accounts/new">
            <Plus className="w-4 h-4" />
            Nueva Cuenta
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {/* Accounts Grid */}
      {accountsList && accountsList.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {accountsList.map((account) => (
            <div className="" key={account.id}>
              <AccountCard account={account} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tienes cuentas aún</h3>
          <p className="text-muted-foreground mb-6">
            Comienza creando tu primera cuenta para gestionar tus finanzas.
          </p>
          <Button asChild>
            <Link href="/accounts/new">
              <Plus className="w-4 h-4" />
              Crear tu primera cuenta
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
