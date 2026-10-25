-- ========================================================
-- ORAL HEALTH CLINICAL WORKSTATION - EXAMINERS REGISTRY
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fsrxpnytgdjifbhxvcpt/sql/new
-- ========================================================

-- 1. Create separate examiners table
CREATE TABLE IF NOT EXISTS public.examiners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  examiner_id varchar(50) UNIQUE NOT NULL,
  examiner_name varchar(100) NOT NULL,
  mobile_number varchar(20),
  email varchar(100),
  photo_url text,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Indexes for fast retrieval by examiner_id or auth user
CREATE INDEX IF NOT EXISTS examiners_examiner_id_idx ON public.examiners (examiner_id);
CREATE INDEX IF NOT EXISTS examiners_auth_user_id_idx ON public.examiners (auth_user_id);

-- 3. Row Level Security (RLS)
ALTER TABLE public.examiners ENABLE ROW LEVEL SECURITY;

-- Allow reading examiner profiles (needed during survey to retrieve examiner info by ID)
DROP POLICY IF EXISTS "Allow public read access to examiners" ON public.examiners;
CREATE POLICY "Allow public read access to examiners"
  ON public.examiners FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update their examiner profile
DROP POLICY IF EXISTS "Allow authenticated users to insert examiners" ON public.examiners;
CREATE POLICY "Allow authenticated users to insert examiners"
  ON public.examiners FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update their own examiner profile" ON public.examiners;
CREATE POLICY "Allow authenticated users to update their own examiner profile"
  ON public.examiners FOR UPDATE
  USING (auth.uid() = auth_user_id OR auth.uid() IS NOT NULL);
