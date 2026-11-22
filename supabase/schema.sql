-- Ekmutho Hashi (একমুঠো হাসি) Supabase Database Schema
-- Run this script in your Supabase SQL Editor: Dashboard -> SQL Editor -> New query -> Run

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT,
  description TEXT,
  target_amount NUMERIC DEFAULT 0,
  target_families INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'active',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS public.inventory (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT NOT NULL,
  qty_purchased NUMERIC DEFAULT 0,
  qty_donated NUMERIC DEFAULT 0,
  qty_distributed NUMERIC DEFAULT 0,
  unit_cost NUMERIC DEFAULT 0,
  min_alert_stock NUMERIC DEFAULT 10,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. PACKAGES TABLE (RELIEF BUNDLES)
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  bangla_name TEXT,
  campaign_id TEXT,
  description TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. DONORS TABLE (FUND COLLECTIONS)
CREATE TABLE IF NOT EXISTS public.donors (
  id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL,
  donor_name TEXT NOT NULL,
  phone TEXT,
  reference TEXT,
  campaign_id TEXT,
  contribution_type TEXT NOT NULL,
  amount NUMERIC DEFAULT 0,
  product_details JSONB,
  payment_method TEXT,
  transaction_id TEXT,
  date TEXT,
  note TEXT,
  recorded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. BENEFICIARIES TABLE (NEEDY FAMILIES)
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id TEXT PRIMARY KEY,
  family_id TEXT NOT NULL,
  token_number TEXT NOT NULL,
  head_name TEXT NOT NULL,
  guardian_name TEXT,
  mobile TEXT,
  area TEXT,
  nid TEXT,
  family_members INTEGER DEFAULT 1,
  priority_category TEXT,
  status TEXT DEFAULT 'Pending',
  notes TEXT,
  aid_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. EXPENSES & DISTRIBUTION LEDGER
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  campaign_id TEXT,
  type TEXT NOT NULL,
  category TEXT,
  amount NUMERIC DEFAULT 0,
  payment_method TEXT,
  handled_by TEXT,
  linked_beneficiary_id TEXT,
  linked_beneficiary_name TEXT,
  note TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  is_distribution BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. STAFF & VOLUNTEERS TABLE (WITH ADMIN APPROVALS)
CREATE TABLE IF NOT EXISTS public.staff_members (
  id TEXT PRIMARY KEY,
  staff_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'Field Volunteer',
  area TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  joined_date TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

-- Allow read & write access for authenticated users (volunteers) & anon keys
CREATE POLICY "Allow public read access for campaigns" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public write access for campaigns" ON public.campaigns FOR ALL USING (true);

CREATE POLICY "Allow public read access for inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Allow public write access for inventory" ON public.inventory FOR ALL USING (true);

CREATE POLICY "Allow public read access for packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public write access for packages" ON public.packages FOR ALL USING (true);

CREATE POLICY "Allow public read access for donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Allow public write access for donors" ON public.donors FOR ALL USING (true);

CREATE POLICY "Allow public read access for beneficiaries" ON public.beneficiaries FOR SELECT USING (true);
CREATE POLICY "Allow public write access for beneficiaries" ON public.beneficiaries FOR ALL USING (true);

CREATE POLICY "Allow public read access for expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow public write access for expenses" ON public.expenses FOR ALL USING (true);

CREATE POLICY "Allow public read access for staff_members" ON public.staff_members FOR SELECT USING (true);
CREATE POLICY "Allow public write access for staff_members" ON public.staff_members FOR ALL USING (true);

-- Enable Realtime publication so multi-phone updates sync live
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE public.packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.donors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.beneficiaries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.staff_members;
