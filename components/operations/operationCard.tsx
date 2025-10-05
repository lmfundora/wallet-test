import { ArrowDown, ArrowUp } from "lucide-react";
import type { Transaction } from "@/lib/types/transactions"; // Ensure correct import for Transaction type
import { Card } from "../ui/card";
import { Account } from "@/lib/types/account";

export default function TransactionCard({
  transaction,
  account,
}: {
  transaction: Transaction;
  account?: Account;
}) {
  const isDeposit = transaction.type === "deposit";
  const icon = isDeposit ? (
    <ArrowUp className="w-4 h-4 text-green-500" />
  ) : (
    <ArrowDown className="w-4 h-4 text-red-500" />
  );

  return (
    <Card className="flex md:flex-row items-center space-x-4 p-4">
      <div
        className={`"flex h-10 w-10 shrink-0 items-center justify-center rounded-full" ${isDeposit ? "bg-green-100" : "bg-red-100"}`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium leading-none">
          {isDeposit ? "Depósito" : "Retiro"} en {account?.name}
        </p>
        <p className="text-muted-foreground text-sm">
          {transaction.description || "Sin descripción"}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(transaction.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div
        className={`
          "text-lg font-semibold"
          ${isDeposit ? "text-green-600" : "text-red-600"}
        `}
      >
        {new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: account?.currency || "USD",
        }).format(parseFloat(transaction.amount))}
      </div>
    </Card>
  );
}
