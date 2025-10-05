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
import { Wallet } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

type AccountData = {
  name: string;
  currency: string;
  balance?: number;
};

type AccountFormParams = {
  form: UseFormReturn<any, any, any>;
  isPending: boolean;
  action: (data: AccountData) => Promise<void>;
  isUpdating?: boolean;
};

export default function AccountForm({
  form,
  isPending,
  action,
  isUpdating = false,
}: AccountFormParams) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Información de la cuenta
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(action)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la cuenta *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ej., Cuenta Corriente Principal, Cuenta de Ahorros"
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ej., USD, EUR, GBP, JPY"
                      className="w-full uppercase"
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    Ingresa el código de la moneda (ej., USD, EUR, GBP, JPY,
                    CAD, etc.)
                  </p>
                </FormItem>
              )}
            />

            {!isUpdating && (
              <FormField
                control={form.control}
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Inicial</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="w-full"
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Ingresa el saldo actual de esta cuenta (opcional, por
                      defecto es 0).
                    </p>
                  </FormItem>
                )}
              />
            )}

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
                className="flex-1"
              >
                {isPending
                  ? isUpdating
                    ? "Actualizando Cuenta..."
                    : "Creando Cuenta..."
                  : isUpdating
                    ? "Actualizar Cuenta"
                    : "Crear Cuenta"}
              </Button>
              <Button asChild variant="ghost" disabled={isPending}>
                <Link href="/accounts">Cancelar</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
