import * as z from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.string().min(1, "Currency is required"),
  balance: z.number().optional().default(0),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, "Name is required"),
  currency: z.string().min(1, "Currency is required"),
});
