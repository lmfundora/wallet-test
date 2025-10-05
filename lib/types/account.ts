import { InferSelectModel } from "drizzle-orm";
import { monetaryAccounts } from "@/lib/db/schema/accounts";

export type Account = InferSelectModel<typeof monetaryAccounts>;
