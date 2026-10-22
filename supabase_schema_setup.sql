-- =====================================================================
-- ORAL HEALTH CLINICAL WORKSTATION - COMPLETE SUPABASE SETUP
-- Copy and run this entire script in Supabase Dashboard -> SQL Editor
-- Project: https://supabase.com/dashboard/project/fsrxpnytgdjifbhxvcpt/sql/new
-- =====================================================================

-- 1. Create Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sex') THEN
    CREATE TYPE public.sex AS ENUM ('male', 'female');
  END IF;
END $$;

-- 2. Create Users Table (Profile table linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username varchar(50) NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT users_username_unique UNIQUE (username)
);

-- In case users table already had a password_hash column from older schemas, make it optional
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
  END IF;
END $$;

-- 3. Create Patient Records Table
CREATE TABLE IF NOT EXISTS public.patient_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  participant_id varchar(50) NOT NULL,
  patient_name varchar(150) NOT NULL,
  exam_date date NOT NULL,
  examiner_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  examiner_code varchar(50),
  village varchar(150),
  phone_number varchar(10),
  sex public.sex NOT NULL,
  dob date,
  education smallint,
  ethnic_group varchar(50),
  ethnic_group_other varchar(150),
  occupation varchar(5),
  occupation_other varchar(150),
  habits text,
  fluorosis varchar(2),
  tdi varchar(2),
  oml_present boolean DEFAULT false NOT NULL,
  oml_site varchar(2),
  oml_condition varchar(2),
  oml_other_details text,
  pros_upper varchar(2),
  pros_lower varchar(2),
  treatment varchar(2),
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT chk_occupation CHECK (occupation IS NULL OR occupation IN ('0','1','2','3')),
  CONSTRAINT chk_fluorosis CHECK (fluorosis IS NULL OR fluorosis IN ('0','1','2','3','4','5','9')),
  CONSTRAINT chk_tdi CHECK (tdi IS NULL OR tdi IN ('0','1','2','3','4','5','6','9')),
  CONSTRAINT chk_pros_upper CHECK (pros_upper IS NULL OR pros_upper IN ('0','1','2','3','4','9')),
  CONSTRAINT chk_pros_lower CHECK (pros_lower IS NULL OR pros_lower IN ('0','1','2','3','4','9')),
  CONSTRAINT chk_treatment CHECK (treatment IS NULL OR treatment IN ('0','1','2','3','4','5','6','7','8','9'))
);

CREATE INDEX IF NOT EXISTS patient_records_examiner_idx ON public.patient_records (examiner_id);
CREATE INDEX IF NOT EXISTS patient_records_participant_idx ON public.patient_records (participant_id);
CREATE INDEX IF NOT EXISTS patient_records_exam_date_idx ON public.patient_records (exam_date);

-- 4. Create Teeth Status Table
CREATE TABLE IF NOT EXISTS public.teeth_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  record_id uuid NOT NULL REFERENCES public.patient_records(id) ON DELETE CASCADE,
  tooth_num smallint NOT NULL,
  crown_code varchar(2),
  root_code varchar(2),
  CONSTRAINT teeth_status_record_tooth_uq UNIQUE (record_id, tooth_num),
  CONSTRAINT chk_teeth_tooth_num CHECK (
    tooth_num BETWEEN 11 AND 18 OR tooth_num BETWEEN 21 AND 28 OR
    tooth_num BETWEEN 31 AND 38 OR tooth_num BETWEEN 41 AND 48
  ),
  CONSTRAINT chk_crown_code CHECK (crown_code IS NULL OR crown_code IN ('0','1','2','3','4','5','6','7','8','9','T')),
  CONSTRAINT chk_root_code CHECK (root_code IS NULL OR root_code IN ('0','1','2','3','7','8','9'))
);

CREATE INDEX IF NOT EXISTS teeth_status_record_idx ON public.teeth_status (record_id);

-- 5. Create Periodontal Tooth Table
CREATE TABLE IF NOT EXISTS public.perio_tooth (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  record_id uuid NOT NULL REFERENCES public.patient_records(id) ON DELETE CASCADE,
  tooth_num smallint NOT NULL,
  present boolean DEFAULT true NOT NULL,
  implant boolean DEFAULT false NOT NULL,
  mobility smallint DEFAULT 0 NOT NULL,
  furcation_b smallint DEFAULT 0 NOT NULL,
  furcation_dp smallint DEFAULT 0 NOT NULL,
  furcation_mp smallint DEFAULT 0 NOT NULL,
  furcation_l smallint DEFAULT 0 NOT NULL,
  note text,
  CONSTRAINT perio_tooth_record_tooth_uq UNIQUE (record_id, tooth_num),
  CONSTRAINT chk_perio_tooth_num CHECK (
    tooth_num BETWEEN 11 AND 18 OR tooth_num BETWEEN 21 AND 28 OR
    tooth_num BETWEEN 31 AND 38 OR tooth_num BETWEEN 41 AND 48
  ),
  CONSTRAINT chk_mobility CHECK (mobility BETWEEN 0 AND 3),
  CONSTRAINT chk_furcation CHECK (
    furcation_b BETWEEN 0 AND 3 AND furcation_dp BETWEEN 0 AND 3 AND
    furcation_mp BETWEEN 0 AND 3 AND furcation_l BETWEEN 0 AND 3
  )
);

CREATE INDEX IF NOT EXISTS perio_tooth_record_idx ON public.perio_tooth (record_id);

-- 6. Create Periodontal Site Table (6 Sites per Tooth)
CREATE TABLE IF NOT EXISTS public.perio_site (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  perio_tooth_id uuid NOT NULL REFERENCES public.perio_tooth(id) ON DELETE CASCADE,
  site varchar(3) NOT NULL,
  bop boolean DEFAULT false NOT NULL,
  plaque boolean DEFAULT false NOT NULL,
  gm smallint DEFAULT 0 NOT NULL,
  pd smallint DEFAULT 2 NOT NULL,
  CONSTRAINT perio_site_tooth_site_uq UNIQUE (perio_tooth_id, site),
  CONSTRAINT chk_site CHECK (site IN ('db','b','mb','dp','p','mp','dl','l','ml'))
);

CREATE INDEX IF NOT EXISTS perio_site_tooth_idx ON public.perio_site (perio_tooth_id);

-- 7. Create Periodontal Sextant Table
CREATE TABLE IF NOT EXISTS public.perio_sextant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  record_id uuid NOT NULL REFERENCES public.patient_records(id) ON DELETE CASCADE,
  sextant smallint NOT NULL,
  cpi varchar(2),
  loa varchar(2),
  CONSTRAINT perio_sextant_record_sextant_uq UNIQUE (record_id, sextant),
  CONSTRAINT chk_sextant CHECK (sextant BETWEEN 0 AND 5),
  CONSTRAINT chk_cpi CHECK (cpi IS NULL OR cpi IN ('0','1','2','3','4','9','X')),
  CONSTRAINT chk_loa CHECK (loa IS NULL OR loa IN ('0','1','2','3','4','9','X'))
);

CREATE INDEX IF NOT EXISTS perio_sextant_record_idx ON public.perio_sextant (record_id);

-- 8. Safe Examiner Profile Creation Trigger Function
CREATE OR REPLACE FUNCTION public.create_examiner_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_name text;
BEGIN
  profile_name := left(
    coalesce(nullif(new.raw_user_meta_data->>'username', ''), split_part(coalesce(new.email, 'examiner'), '@', 1)),
    35
  ) || '-' || left(new.id::text, 8);

  INSERT INTO public.users (id, username)
  VALUES (new.id, profile_name)
  ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;

  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Fallback: Do not block auth.users signup under any circumstance
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_examiner_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_examiner_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_examiner_profile();

-- 9. Row Level Security (RLS) Configuration
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teeth_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_tooth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_sextant ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teeth_status TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_tooth TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_site TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_sextant TO authenticated;

-- Policies for public.users
DROP POLICY IF EXISTS users_read_own_profile ON public.users;
CREATE POLICY users_read_own_profile ON public.users
  FOR SELECT TO authenticated USING (id = auth.uid());

-- Policies for public.patient_records
DROP POLICY IF EXISTS patient_records_select_own ON public.patient_records;
CREATE POLICY patient_records_select_own ON public.patient_records
  FOR SELECT TO authenticated USING (examiner_id = auth.uid());

DROP POLICY IF EXISTS patient_records_insert_own ON public.patient_records;
CREATE POLICY patient_records_insert_own ON public.patient_records
  FOR INSERT TO authenticated WITH CHECK (examiner_id = auth.uid());

DROP POLICY IF EXISTS patient_records_update_own ON public.patient_records;
CREATE POLICY patient_records_update_own ON public.patient_records
  FOR UPDATE TO authenticated USING (examiner_id = auth.uid()) WITH CHECK (examiner_id = auth.uid());

DROP POLICY IF EXISTS patient_records_delete_own ON public.patient_records;
CREATE POLICY patient_records_delete_own ON public.patient_records
  FOR DELETE TO authenticated USING (examiner_id = auth.uid());

-- Policies for child tables
DROP POLICY IF EXISTS teeth_status_all ON public.teeth_status;
CREATE POLICY teeth_status_all ON public.teeth_status
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  );

DROP POLICY IF EXISTS perio_tooth_all ON public.perio_tooth;
CREATE POLICY perio_tooth_all ON public.perio_tooth
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  );

DROP POLICY IF EXISTS perio_site_all ON public.perio_site;
CREATE POLICY perio_site_all ON public.perio_site
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.perio_tooth t
      JOIN public.patient_records r ON r.id = t.record_id
      WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.perio_tooth t
      JOIN public.patient_records r ON r.id = t.record_id
      WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS perio_sextant_all ON public.perio_sextant;
CREATE POLICY perio_sextant_all ON public.perio_sextant
  FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid())
  );

-- 10. Stored Procedure: save_clinical_record
CREATE OR REPLACE FUNCTION public.save_clinical_record(p_record jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record_id uuid;
  tooth_entry record;
  site_entry record;
  tooth_id uuid;
  tooth_num smallint;
  perio_data jsonb;
  sex_value public.sex;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication is required';
  END IF;

  sex_value := CASE p_record->>'sex'
    WHEN 'male' THEN 'male'::public.sex
    WHEN 'female' THEN 'female'::public.sex
    ELSE NULL
  END;
  IF sex_value IS NULL THEN
    RAISE EXCEPTION 'Sex must be male or female';
  END IF;

  IF coalesce(p_record->>'id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    v_record_id := (p_record->>'id')::uuid;
  ELSE
    v_record_id := gen_random_uuid();
  END IF;

  INSERT INTO public.patient_records (
    id, participant_id, patient_name, exam_date, examiner_id, examiner_code,
    village, phone_number, sex, dob, education, ethnic_group, ethnic_group_other,
    occupation, occupation_other, habits, fluorosis, tdi, oml_present, oml_site,
    oml_condition, pros_upper, pros_lower, treatment, notes
  ) VALUES (
    v_record_id,
    p_record->>'participantId',
    p_record->>'patientName',
    (p_record->>'examDate')::date,
    auth.uid(),
    nullif(p_record->>'examinerId', ''),
    nullif(p_record->>'village', ''),
    nullif(p_record->>'phoneNumber', ''),
    sex_value,
    nullif(p_record->>'dob', '')::date,
    nullif(p_record->>'education', '')::smallint,
    nullif(p_record->>'ethnicGroup', ''),
    nullif(p_record->>'ethnicGroupOther', ''),
    nullif(p_record->>'occupation', ''),
    nullif(p_record->>'occupationOther', ''),
    nullif(p_record->>'habits', ''),
    nullif(p_record->>'fluorosis', ''),
    nullif(p_record->>'tdi', ''),
    coalesce(p_record->>'omlPresent' = 'Y', false),
    nullif(p_record->>'omlSite', ''),
    nullif(p_record->>'omlCondition', ''),
    nullif(p_record->>'prosUpper', ''),
    nullif(p_record->>'prosLower', ''),
    nullif(p_record->>'treatment', ''),
    nullif(p_record->>'notes', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    participant_id = EXCLUDED.participant_id,
    patient_name = EXCLUDED.patient_name,
    exam_date = EXCLUDED.exam_date,
    examiner_id = auth.uid(),
    examiner_code = EXCLUDED.examiner_code,
    village = EXCLUDED.village,
    phone_number = EXCLUDED.phone_number,
    sex = EXCLUDED.sex,
    dob = EXCLUDED.dob,
    education = EXCLUDED.education,
    ethnic_group = EXCLUDED.ethnic_group,
    ethnic_group_other = EXCLUDED.ethnic_group_other,
    occupation = EXCLUDED.occupation,
    occupation_other = EXCLUDED.occupation_other,
    habits = EXCLUDED.habits,
    fluorosis = EXCLUDED.fluorosis,
    tdi = EXCLUDED.tdi,
    oml_present = EXCLUDED.oml_present,
    oml_site = EXCLUDED.oml_site,
    oml_condition = EXCLUDED.oml_condition,
    pros_upper = EXCLUDED.pros_upper,
    pros_lower = EXCLUDED.pros_lower,
    treatment = EXCLUDED.treatment,
    notes = EXCLUDED.notes,
    updated_at = now();

  DELETE FROM public.teeth_status AS teeth WHERE teeth.record_id = v_record_id;
  DELETE FROM public.perio_sextant AS sextants WHERE sextants.record_id = v_record_id;
  DELETE FROM public.perio_tooth AS perio WHERE perio.record_id = v_record_id;

  FOR tooth_entry IN SELECT * FROM jsonb_each(coalesce(p_record->'teeth', '{}'::jsonb)) LOOP
    tooth_num := tooth_entry.key::smallint;
    INSERT INTO public.teeth_status (record_id, tooth_num, crown_code, root_code)
    VALUES (
      v_record_id,
      tooth_num,
      nullif(tooth_entry.value->>'crown', ''),
      nullif(tooth_entry.value->>'root', '')
    );
  END LOOP;

  FOR tooth_entry IN SELECT * FROM jsonb_each(coalesce(p_record->'perio', '{}'::jsonb)) LOOP
    tooth_num := tooth_entry.key::smallint;
    perio_data := tooth_entry.value;
    INSERT INTO public.perio_tooth (
      record_id, tooth_num, present, implant, mobility,
      furcation_b, furcation_dp, furcation_mp, furcation_l, note
    ) VALUES (
      v_record_id,
      tooth_num,
      coalesce((perio_data->>'present')::boolean, true),
      coalesce((perio_data->>'implant')::boolean, false),
      coalesce(nullif(perio_data->>'mobility', '')::smallint, 0),
      coalesce(nullif(perio_data->'furcation'->>'b', '')::smallint, 0),
      coalesce(nullif(perio_data->'furcation'->>'dp', '')::smallint, 0),
      coalesce(nullif(perio_data->'furcation'->>'mp', '')::smallint, 0),
      coalesce(nullif(perio_data->'furcation'->>'l', '')::smallint, 0),
      nullif(perio_data->>'note', '')
    ) RETURNING id INTO tooth_id;

    FOR site_entry IN SELECT * FROM jsonb_each(coalesce(perio_data->'pd', '{}'::jsonb)) LOOP
      INSERT INTO public.perio_site (perio_tooth_id, site, bop, plaque, gm, pd)
      VALUES (
        tooth_id,
        site_entry.key,
        coalesce((perio_data->'bop'->>site_entry.key)::boolean, false),
        coalesce((perio_data->'plaque'->>site_entry.key)::boolean, false),
        coalesce(nullif(perio_data->'gm'->>site_entry.key, '')::smallint, 0),
        coalesce(nullif(site_entry.value #>> '{}', '')::smallint, 2)
      );
    END LOOP;
  END LOOP;

  FOR tooth_num IN 0..5 LOOP
    INSERT INTO public.perio_sextant (record_id, sextant, cpi, loa)
    VALUES (
      v_record_id,
      tooth_num,
      nullif(p_record->'cpi'->>tooth_num, ''),
      nullif(p_record->'loa'->>tooth_num, '')
    );
  END LOOP;

  RETURN v_record_id;
END;
$$;

REVOKE ALL ON FUNCTION public.save_clinical_record(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_clinical_record(jsonb) TO authenticated;
