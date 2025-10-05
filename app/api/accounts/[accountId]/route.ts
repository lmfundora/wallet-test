import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { monetaryAccounts } from "@/lib/db/schema/accounts";
import { and, eq } from "drizzle-orm";
import * as z from "zod";
import { headers } from "next/headers";
import { updateAccountSchema } from "@/lib/zodSchemes/accountsScheme";

export async function GET(
  req: NextRequest,
  { params }: { params: { accountId: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const accountId = parseInt(params.accountId, 10);
    if (isNaN(accountId)) {
      return new NextResponse("Invalid Account ID", { status: 400 });
    }

    const [account] = await db
      .select()
      .from(monetaryAccounts)
      .where(
        and(
          eq(monetaryAccounts.id, accountId),
          eq(monetaryAccounts.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!account) {
      return new NextResponse("Account not found or access denied", {
        status: 404,
      });
    }

    return NextResponse.json(account);
  } catch (error) {
    console.error("[ACCOUNT_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { accountId: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const accountId = parseInt(params.accountId, 10);
    if (isNaN(accountId)) {
      return new NextResponse("Invalid Account ID", { status: 400 });
    }

    const json = await req.json();
    const body = updateAccountSchema.parse(json);

    const [updatedAccount] = await db
      .update(monetaryAccounts)
      .set(body)
      .where(
        and(
          eq(monetaryAccounts.id, accountId),
          eq(monetaryAccounts.userId, session.user.id),
        ),
      )
      .returning();

    if (!updatedAccount) {
      return new NextResponse("Account not found or access denied", {
        status: 404,
      });
    }

    return NextResponse.json(updatedAccount);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
    console.error("[ACCOUNT_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { accountId: string } },
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const accountId = parseInt(params.accountId, 10);
    if (isNaN(accountId)) {
      return new NextResponse("Invalid Account ID", { status: 400 });
    }

    const [deletedAccount] = await db
      .delete(monetaryAccounts)
      .where(
        and(
          eq(monetaryAccounts.id, accountId),
          eq(monetaryAccounts.userId, session.user.id),
        ),
      )
      .returning();

    if (!deletedAccount) {
      return new NextResponse("Account not found or access denied", {
        status: 404,
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ACCOUNT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
