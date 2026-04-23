-- ===================================================
-- FIX FOREIGN KEY CONSTRAINT FOR CUSTOM AUTH
-- Run this in Supabase SQL Editor
-- ===================================================

-- The customers table has a foreign key constraint to users table (from Supabase Auth)
-- Since we're using custom phone+password auth (not Supabase Auth), we need to remove this

-- Step 1: Drop the foreign key constraint
ALTER TABLE public.customers
DROP CONSTRAINT customers_id_fkey;

-- Step 2: Verify it's gone
-- Run this to check:
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'customers' AND constraint_type = 'FOREIGN KEY';

-- Should return empty result (no FOREIGN KEY constraints)

-- ===================================================
-- EXPLANATION
-- ===================================================
-- Why remove it?
-- - Original schema expected customers.id → users.id (Supabase Auth table)
-- - We're doing custom phone+password auth (not using Supabase Auth)
-- - So there's no users table to reference
-- - Removing the constraint lets us use our own UUIDs
--
-- Is this safe?
-- - Yes! We're now responsible for generating valid UUIDs
-- - crypto.randomUUID() in AuthContext generates valid UUIDs
-- - No circular dependencies or orphaned data
-- ===================================================
