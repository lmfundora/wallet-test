import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { transactions, monetaryAccounts } from "@/lib/db/schema/accounts";
import { eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";
import { createTransactionSchema } from "@/lib/zodSchemes/transactions";

const getTransactionsSchema = z.object({
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  accountId: z.coerce.number().int().positive().optional(),
});

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);

  const queryParams = Object.fromEntries(searchParams.entries());
  const parsedQueryParams = getTransactionsSchema.safeParse(queryParams);

  if (!parsedQueryParams.success) {
    return new NextResponse(
      `Invalid query parameters: ${parsedQueryParams.error}`,
      { status: 400 },
    );
  }

  const { startDate, endDate, accountId } = parsedQueryParams.data;

  try {
    const conditions = [eq(monetaryAccounts.userId, userId)];

    if (startDate) {
      conditions.push(gte(transactions.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditions.push(lte(transactions.createdAt, new Date(endDate)));
    }
    if (accountId) {
      conditions.push(eq(transactions.accountId, accountId));
    }

    const userTransactions = await db
      .select({
        id: transactions.id,
        accountId: transactions.accountId,
        type: transactions.type,
        amount: transactions.amount,
        description: transactions.description,
        createdAt: transactions.createdAt,
        accountName: monetaryAccounts.name,
        accountCurrency: monetaryAccounts.currency,
      })
      .from(transactions)
      .innerJoin(
        monetaryAccounts,
        eq(transactions.accountId, monetaryAccounts.id),
      )
      .where(and(...conditions));

    return NextResponse.json(userTransactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const parsedBody = createTransactionSchema.safeParse(body);

  if (!parsedBody.success) {
    return new NextResponse(`Invalid request body: ${parsedBody.error}`, {
      status: 400,
    });
  }

  const { accountId, type, amount, description } = parsedBody.data;

  try {
    const account = await db
      .select()
      .from(monetaryAccounts)
      .where(
        and(
          eq(monetaryAccounts.id, accountId),
          eq(monetaryAccounts.userId, userId),
        ),
      )
      .limit(1);

    if (!account.length) {
      return new NextResponse("Account not found or not owned by user", {
        status: 404,
      });
    }

    let newTransaction = await db
      .insert(transactions)
      .values({
        accountId,
        type,
        amount,
        description,
      })
      .returning();

    let newBalance = parseFloat(account[0].balance);
    const transactionAmount = parseFloat(amount);

    if (type === "deposit") {
      newBalance += transactionAmount;
    } else if (type === "withdrawal") {
      newBalance -= transactionAmount;
    }

    await db
      .update(monetaryAccounts)
      .set({ balance: newBalance.toFixed(4) })
      .where(eq(monetaryAccounts.id, accountId));

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
