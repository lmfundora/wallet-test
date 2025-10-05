"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useTransaction } from "@/hooks/useTransacion";
import { createTransactionSchema } from "@/lib/zodSchemes/transactions";
import type { CreateTransactionData } from "@/lib/types/transactions";
import { useAccounts } from "@/hooks/useAccounts";

type FormData = z.infer<typeof createTransactionSchema>;

export default function NewTransaction() {
  const router = useRouter();
  const { mutateAsync: createTransactionMutation, isPending } =
    useTransaction.useCreateTransaction();
  const { data: accounts, isLoading: isLoadingAccounts } =
    useAccounts.accounts();

  const form = useForm<FormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      accountId: undefined,
      type: "deposit",
      amount: "0.00",
      description: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const createData: CreateTransactionData = {
        accountId: data.accountId,
        type: data.type,
        amount: data.amount,
        description: data.description,
      };

      await createTransactionMutation(createData);

      toast.success("Transacción creada exitosamente!");
      router.push("/operations");
    } catch (error) {
      toast.error("Error al crear la transacción");
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/transactions">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Crear nueva Operación
          </h1>
        </div>
      </div>

      <Card
        className={
          form.watch().type === "deposit"
            ? "border-green-300 shadow-green-300/50"
            : "border-pink-300 shadow-pink-300/50"
        }
      >
        <CardHeader>
          <CardTitle>Detalles de la Transacción</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Account Selector */}
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuenta</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? String(field.value) : ""}
                      disabled={isLoadingAccounts || !accounts}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una cuenta" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingAccounts ? (
                          <SelectItem value="loading" disabled>
                            Cargando cuentas...
                          </SelectItem>
                        ) : accounts && accounts.length > 0 ? (
                          accounts.map((account) => (
                            <SelectItem
                              key={account.id}
                              value={String(account.id)}
                            >
                              {account.name} ({account.currency}{" "}
                              {account.balance})
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-accounts" disabled>
                            No hay cuentas disponibles
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Selector */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Transacción</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="deposit">Depósito</SelectItem>
                        <SelectItem value="withdrawal">Retiro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Amount Input */}
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ej. 100.50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Input */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descripción de la transacción"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isPending}
                variant={`${form.watch().type !== "deposit" ? "destructive" : "default"}`}
              >
                {isPending ? "Creando..." : "Crear Transacción"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
