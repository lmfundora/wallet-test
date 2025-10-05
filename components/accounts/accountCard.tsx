import type { Account } from "@/lib/types/account";

import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Edit, Trash2, Wallet } from "lucide-react";
import { DeleteDialog } from "../common/deleteDialog";
import { deleteAccount } from "@/hooks/useAccounts";

export default function AccountCard({ account }: { account: Account }) {
  const deleteAccountMutation = deleteAccount();
  const formatBalance = (balance: string, currency: string) => {
    const num = parseFloat(balance);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(num);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync(account.id);
      toast.success("Cuenta eliminada exitosamente!");
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Card key={account.id} className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {account.name}
        </CardTitle>
        <CardAction>
          <div className="flex gap-1">
            <Button size="icon-sm" variant="ghost" asChild>
              <Link href={`/accounts/update?id=${account.id}`}>
                <Edit className="w-4 h-4" />
              </Link>
            </Button>
            <DeleteDialog
              onDelete={handleDeleteAccount}
              deletingThing="la cuenta"
            >
              <Button
                size="icon-sm"
                variant="ghost"
                disabled={deleteAccountMutation.isPending}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </DeleteDialog>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Saldo</span>
            <span className="text-2xl font-bold text-primary flex items-center gap-1">
              {formatBalance(account.balance, account.currency)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Moneda</span>
            <span className="font-medium">{account.currency}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Creado</span>
            <span className="font-medium">
              {new Date(account.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
