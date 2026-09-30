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
    40
  ) || '-' || left(new.id::text, 8);

  INSERT INTO public.users (id, username)
  VALUES (new.id, profile_name)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;
--> statement-breakpoint

DROP TRIGGER IF EXISTS on_auth_user_created_examiner_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_examiner_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_examiner_profile();
--> statement-breakpoint

INSERT INTO public.users (id, username)
SELECT
  u.id,
  left(coalesce(nullif(u.raw_user_meta_data->>'username', ''), split_part(coalesce(u.email, 'examiner'), '@', 1)), 40)
    || '-' || left(u.id::text, 8)
FROM auth.users u
ON CONFLICT (id) DO NOTHING;
--> statement-breakpoint

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teeth_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_tooth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_site ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perio_sextant ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint

GRANT SELECT ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_records TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teeth_status TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_tooth TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_site TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.perio_sextant TO authenticated;
--> statement-breakpoint

CREATE POLICY users_read_own_profile ON public.users
  FOR SELECT TO authenticated USING (id = auth.uid());
--> statement-breakpoint

CREATE POLICY patient_records_select_own ON public.patient_records
  FOR SELECT TO authenticated USING (examiner_id = auth.uid());
CREATE POLICY patient_records_insert_own ON public.patient_records
  FOR INSERT TO authenticated WITH CHECK (examiner_id = auth.uid());
CREATE POLICY patient_records_update_own ON public.patient_records
  FOR UPDATE TO authenticated USING (examiner_id = auth.uid()) WITH CHECK (examiner_id = auth.uid());
CREATE POLICY patient_records_delete_own ON public.patient_records
  FOR DELETE TO authenticated USING (examiner_id = auth.uid());
--> statement-breakpoint

CREATE POLICY teeth_status_read_own ON public.teeth_status
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY teeth_status_insert_own ON public.teeth_status
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY teeth_status_update_own ON public.teeth_status
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY teeth_status_delete_own ON public.teeth_status
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
--> statement-breakpoint

CREATE POLICY perio_tooth_read_own ON public.perio_tooth
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_tooth_insert_own ON public.perio_tooth
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_tooth_update_own ON public.perio_tooth
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_tooth_delete_own ON public.perio_tooth
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
--> statement-breakpoint

CREATE POLICY perio_site_read_own ON public.perio_site
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.perio_tooth t
    JOIN public.patient_records r ON r.id = t.record_id
    WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_site_insert_own ON public.perio_site
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.perio_tooth t
    JOIN public.patient_records r ON r.id = t.record_id
    WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_site_update_own ON public.perio_site
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.perio_tooth t
    JOIN public.patient_records r ON r.id = t.record_id
    WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.perio_tooth t
    JOIN public.patient_records r ON r.id = t.record_id
    WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_site_delete_own ON public.perio_site
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.perio_tooth t
    JOIN public.patient_records r ON r.id = t.record_id
    WHERE t.id = perio_tooth_id AND r.examiner_id = auth.uid()
  ));
--> statement-breakpoint

CREATE POLICY perio_sextant_read_own ON public.perio_sextant
  FOR SELECT TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_sextant_insert_own ON public.perio_sextant
  FOR INSERT TO authenticated WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_sextant_update_own ON public.perio_sextant
  FOR UPDATE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  )) WITH CHECK (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
CREATE POLICY perio_sextant_delete_own ON public.perio_sextant
  FOR DELETE TO authenticated USING (EXISTS (
    SELECT 1 FROM public.patient_records r WHERE r.id = record_id AND r.examiner_id = auth.uid()
  ));
--> statement-breakpoint

CREATE OR REPLACE FUNCTION public.save_clinical_record(p_record jsonb)
RETURNS uuid
LANGUAGE plpgsql
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
--> statement-breakpoint

REVOKE ALL ON FUNCTION public.save_clinical_record(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_clinical_record(jsonb) TO authenticated;