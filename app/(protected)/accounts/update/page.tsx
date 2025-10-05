"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import AccountForm from "@/components/accounts/form";

import { accountById, updateAccount } from "@/hooks/useAccounts";
import { updateAccountSchema } from "@/lib/zodSchemes/accountsScheme";
import type { UpdateAccountData } from "@/services/accountsService";
import type * as z from "zod";

type FormData = z.infer<typeof updateAccountSchema>;

function UpdateAccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");

  const {
    data: account,
    isLoading,
    error,
  } = accountById(parseInt(accountId || "0"));
  const updateAccountMutation = updateAccount();

  const form = useForm<FormData>({
    resolver: zodResolver(updateAccountSchema) as any,
    defaultValues: {
      name: account?.name,
      currency: account?.currency,
    },
  });

  useEffect(() => {
    if (account) {
      form.reset({
        name: account.name,
        currency: account.currency,
      });
    }
  }, [account, form]);

  const handleSubmit = async (data: any) => {
    if (!accountId) {
      toast.error("ID de cuenta no encontrado");
      return;
    }

    try {
      const updateData: UpdateAccountData = {
        name: data.name,
        currency: data.currency,
      };

      await updateAccountMutation.mutateAsync({
        accountId: parseInt(accountId),
        data: updateData,
      });

      toast.success("Cuenta actualizada exitosamente!");
      router.push("/accounts");
    } catch (error) {
      toast.error("Error al actualizar la cuenta");
      console.error("Error updating account:", error);
    }
  };

  if (!accountId) {
    router.push("/accounts");
    return null;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando cuenta...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <p className="text-destructive mb-4">
              {error ? `Error: ${error.message}` : "Cuenta no encontrada"}
            </p>
            <Button asChild variant="outline">
              <Link href="/accounts">Volver a Cuentas</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/accounts">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Actualizar Cuenta
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <AccountForm
        form={form}
        isPending={updateAccountMutation.isPending}
        action={handleSubmit}
        isUpdating={true}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    </div>
  );
}

export default function UpdateAccount() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UpdateAccountContent />
    </Suspense>
  );
}
