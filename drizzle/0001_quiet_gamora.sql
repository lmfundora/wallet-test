CREATE TYPE "public"."transaction_type" AS ENUM('deposit', 'withdrawal', 'transfer');--> statement-breakpoint
CREATE TABLE "monetary_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"balance" numeric(19, 4) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"account_id" integer NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(19, 4) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monetary_accounts" ADD CONSTRAINT "monetary_accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_monetary_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."monetary_accounts"("id") ON DELETE cascade ON UPDATE no action;