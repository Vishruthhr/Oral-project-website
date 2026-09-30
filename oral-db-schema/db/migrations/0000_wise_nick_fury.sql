CREATE TYPE "public"."sex" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(50) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "patient_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"participant_id" varchar(50) NOT NULL,
	"patient_name" varchar(150) NOT NULL,
	"exam_date" date NOT NULL,
	"examiner_id" uuid,
	"examiner_code" varchar(50),
	"village" varchar(150),
	"phone_number" varchar(10),
	"sex" "sex" NOT NULL,
	"dob" date,
	"education" smallint,
	"ethnic_group" varchar(50),
	"ethnic_group_other" varchar(150),
	"occupation" varchar(5),
	"occupation_other" varchar(150),
	"habits" text,
	"fluorosis" varchar(2),
	"tdi" varchar(2),
	"oml_present" boolean DEFAULT false NOT NULL,
	"oml_site" varchar(2),
	"oml_condition" varchar(2),
	"oml_other_details" text,
	"pros_upper" varchar(2),
	"pros_lower" varchar(2),
	"treatment" varchar(2),
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_occupation" CHECK ("patient_records"."occupation" IS NULL OR "patient_records"."occupation" IN ('0','1','2','3')),
	CONSTRAINT "chk_fluorosis" CHECK ("patient_records"."fluorosis" IS NULL OR "patient_records"."fluorosis" IN ('0','1','2','3','4','5','9')),
	CONSTRAINT "chk_tdi" CHECK ("patient_records"."tdi" IS NULL OR "patient_records"."tdi" IN ('0','1','2','3','4','5','6','9')),
	CONSTRAINT "chk_pros_upper" CHECK ("patient_records"."pros_upper" IS NULL OR "patient_records"."pros_upper" IN ('0','1','2','3','4','9')),
	CONSTRAINT "chk_pros_lower" CHECK ("patient_records"."pros_lower" IS NULL OR "patient_records"."pros_lower" IN ('0','1','2','3','4','9')),
	CONSTRAINT "chk_treatment" CHECK ("patient_records"."treatment" IS NULL OR "patient_records"."treatment" IN ('0','1','2','3','4','5','6','7','8','9'))
);
--> statement-breakpoint
CREATE TABLE "teeth_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" uuid NOT NULL,
	"tooth_num" smallint NOT NULL,
	"crown_code" varchar(2),
	"root_code" varchar(2),
	CONSTRAINT "teeth_status_record_tooth_uq" UNIQUE("record_id","tooth_num"),
	CONSTRAINT "chk_teeth_tooth_num" CHECK ("teeth_status"."tooth_num" BETWEEN 11 AND 18 OR "teeth_status"."tooth_num" BETWEEN 21 AND 28 OR "teeth_status"."tooth_num" BETWEEN 31 AND 38 OR "teeth_status"."tooth_num" BETWEEN 41 AND 48),
	CONSTRAINT "chk_crown_code" CHECK ("teeth_status"."crown_code" IS NULL OR "teeth_status"."crown_code" IN ('0','1','2','3','4','5','6','7','8','9','T')),
	CONSTRAINT "chk_root_code" CHECK ("teeth_status"."root_code" IS NULL OR "teeth_status"."root_code" IN ('0','1','2','3','7','8','9'))
);
--> statement-breakpoint
CREATE TABLE "perio_tooth" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" uuid NOT NULL,
	"tooth_num" smallint NOT NULL,
	"present" boolean DEFAULT true NOT NULL,
	"implant" boolean DEFAULT false NOT NULL,
	"mobility" smallint DEFAULT 0 NOT NULL,
	"furcation_b" smallint DEFAULT 0 NOT NULL,
	"furcation_dp" smallint DEFAULT 0 NOT NULL,
	"furcation_mp" smallint DEFAULT 0 NOT NULL,
	"furcation_l" smallint DEFAULT 0 NOT NULL,
	"note" text,
	CONSTRAINT "perio_tooth_record_tooth_uq" UNIQUE("record_id","tooth_num"),
	CONSTRAINT "chk_perio_tooth_num" CHECK ("perio_tooth"."tooth_num" BETWEEN 11 AND 18 OR "perio_tooth"."tooth_num" BETWEEN 21 AND 28 OR "perio_tooth"."tooth_num" BETWEEN 31 AND 38 OR "perio_tooth"."tooth_num" BETWEEN 41 AND 48),
	CONSTRAINT "chk_mobility" CHECK ("perio_tooth"."mobility" BETWEEN 0 AND 3),
	CONSTRAINT "chk_furcation" CHECK ("perio_tooth"."furcation_b" BETWEEN 0 AND 3 AND "perio_tooth"."furcation_dp" BETWEEN 0 AND 3 AND "perio_tooth"."furcation_mp" BETWEEN 0 AND 3 AND "perio_tooth"."furcation_l" BETWEEN 0 AND 3)
);
--> statement-breakpoint
CREATE TABLE "perio_site" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"perio_tooth_id" uuid NOT NULL,
	"site" varchar(3) NOT NULL,
	"bop" boolean DEFAULT false NOT NULL,
	"plaque" boolean DEFAULT false NOT NULL,
	"gm" smallint DEFAULT 0 NOT NULL,
	"pd" smallint DEFAULT 2 NOT NULL,
	CONSTRAINT "perio_site_tooth_site_uq" UNIQUE("perio_tooth_id","site"),
	CONSTRAINT "chk_site" CHECK ("perio_site"."site" IN ('db','b','mb','dp','p','mp','dl','l','ml'))
);
--> statement-breakpoint
CREATE TABLE "perio_sextant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"record_id" uuid NOT NULL,
	"sextant" smallint NOT NULL,
	"cpi" varchar(2),
	"loa" varchar(2),
	CONSTRAINT "perio_sextant_record_sextant_uq" UNIQUE("record_id","sextant"),
	CONSTRAINT "chk_sextant" CHECK ("perio_sextant"."sextant" BETWEEN 0 AND 5),
	CONSTRAINT "chk_cpi" CHECK ("perio_sextant"."cpi" IS NULL OR "perio_sextant"."cpi" IN ('0','1','2','3','4','9','X')),
	CONSTRAINT "chk_loa" CHECK ("perio_sextant"."loa" IS NULL OR "perio_sextant"."loa" IN ('0','1','2','3','4','9','X'))
);
--> statement-breakpoint
ALTER TABLE "patient_records" ADD CONSTRAINT "patient_records_examiner_id_users_id_fk" FOREIGN KEY ("examiner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teeth_status" ADD CONSTRAINT "teeth_status_record_id_patient_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."patient_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perio_tooth" ADD CONSTRAINT "perio_tooth_record_id_patient_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."patient_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perio_site" ADD CONSTRAINT "perio_site_perio_tooth_id_perio_tooth_id_fk" FOREIGN KEY ("perio_tooth_id") REFERENCES "public"."perio_tooth"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perio_sextant" ADD CONSTRAINT "perio_sextant_record_id_patient_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."patient_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "patient_records_examiner_idx" ON "patient_records" USING btree ("examiner_id");--> statement-breakpoint
CREATE INDEX "patient_records_participant_idx" ON "patient_records" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX "patient_records_exam_date_idx" ON "patient_records" USING btree ("exam_date");--> statement-breakpoint
CREATE INDEX "teeth_status_record_idx" ON "teeth_status" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "perio_tooth_record_idx" ON "perio_tooth" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "perio_site_tooth_idx" ON "perio_site" USING btree ("perio_tooth_id");--> statement-breakpoint
CREATE INDEX "perio_sextant_record_idx" ON "perio_sextant" USING btree ("record_id");