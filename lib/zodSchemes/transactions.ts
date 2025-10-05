import { z } from "zod";

export const createTransactionSchema = z.object({
  accountId: z.number().int().positive(),
  type: z.enum(["deposit", "withdrawal"]),
  amount: z
    .string()
    .regex(
      /^\d+(\.\d{1,4})?$/,
      "Amount must be a valid decimal string with up to 4 decimal places",
    ),
  description: z.string().optional(),
});
