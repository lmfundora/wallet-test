"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createAccount } from "@/hooks/useAccounts";
import { createAccountSchema } from "@/lib/zodSchemes/accountsScheme";
import type { CreateAccountData } from "@/services/accountsService";
import type * as z from "zod";
import AccountForm from "@/components/accounts/form";

type FormData = z.infer<typeof createAccountSchema>;

export default function NewAccount() {
  const router = useRouter();
  const createAccountMutation = createAccount();

  const form = useForm<FormData>({
    resolver: zodResolver(createAccountSchema) as any,
    defaultValues: {
      name: "",
      currency: "",
      balance: 0,
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      const createData: CreateAccountData = {
        name: data.name,
        currency: data.currency,
        balance: data.balance || 0,
      };

      await createAccountMutation.mutateAsync(createData);

      toast.success("Cuenta creada exitosamente!");
      router.push("/accounts");
    } catch (error) {
      toast.error("Error al crear la cuenta");
      console.error("Error creating account:", error);
    }
  };

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
            Crear nueva Cuenta
          </h1>
        </div>
      </div>

      {/* Form Card */}
      <AccountForm
        form={form}
        isPending={createAccountMutation.isPending}
        action={handleSubmit}
      />
    </div>
  );
}
