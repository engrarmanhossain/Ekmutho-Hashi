-- ==============================================================================
-- Ekmutho Hashi (একমুঠো হাসি) - Automated Supabase Keep-Alive Cron
-- ==============================================================================
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query -> Run
-- This job runs every 3 days at 00:00 UTC and sends a real HTTP request to the 
-- Supabase REST API gateway via pg_net. This registers genuine external activity 
-- and permanently prevents Supabase from pausing your free-tier database.

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- 2. Remove any previous keep-alive jobs to prevent duplicate schedules
DO $$
BEGIN
  PERFORM cron.unschedule('keep_supabase_active_job');
EXCEPTION WHEN OTHERS THEN
  -- Safe to continue if job does not exist yet
END $$;

-- 3. Schedule the Keep-Alive Cron Job
-- Runs every 3 days at 00:00 UTC ('0 0 */3 * *')
SELECT cron.schedule(
  'keep_supabase_active_job',
  '0 0 */3 * *',
  $$ 
    -- Send HTTP GET request directly through Supabase API Gateway
    SELECT net.http_get(
      url := 'https://cvbbwrjoaodtaorehbeg.supabase.co/rest/v1/campaigns?select=id&limit=1',
      headers := jsonb_build_object(
        'apikey', 'sb_publishable_1wHOxWmLOl7rRmpPjou5JA_W5NFqOSl',
        'Authorization', 'Bearer sb_publishable_1wHOxWmLOl7rRmpPjou5JA_W5NFqOSl'
      )
    );
  $$
);

-- ==============================================================================
-- IMMEDIATE TEST & VERIFICATION
-- ==============================================================================

-- Test ping right now (returns request ID):
SELECT net.http_get(
  url := 'https://cvbbwrjoaodtaorehbeg.supabase.co/rest/v1/campaigns?select=id&limit=1',
  headers := jsonb_build_object(
    'apikey', 'sb_publishable_1wHOxWmLOl7rRmpPjou5JA_W5NFqOSl',
    'Authorization', 'Bearer sb_publishable_1wHOxWmLOl7rRmpPjou5JA_W5NFqOSl'
  )
);

-- Check scheduled job:
SELECT jobid, jobname, schedule, active FROM cron.job WHERE jobname = 'keep_supabase_active_job';
