CREATE TABLE IF NOT EXISTS "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(256),
	"last_name" varchar(256),
	"balance" integer,
	CONSTRAINT "accounts_first_name_last_name_unique" UNIQUE("first_name","last_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "toys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256),
	"price" integer,
	CONSTRAINT "toys_name_unique" UNIQUE("name")
);
