import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { monetaryAccounts } from "@/lib/db/schema/accounts";
import { eq } from "drizzle-orm";
import { createAccountSchema } from "@/lib/zodSchemes/accountsScheme";
import * as z from "zod";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const accounts = await db
      .select()
      .from(monetaryAccounts)
      .where(eq(monetaryAccounts.userId, session.user.id));

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("[ACCOUNTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createAccountSchema.parse(json);

    const [newAccount] = await db
      .insert(monetaryAccounts)
      .values({
        userId: session.user.id,
        name: body.name,
        currency: body.currency,
        balance: String(body.balance),
      })
      .returning();

    return NextResponse.json(newAccount, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.message), { status: 400 });
    }
    console.error("[ACCOUNTS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
