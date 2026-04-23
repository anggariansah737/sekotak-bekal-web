-- ===================================================
-- DISABLE RLS ON ALL TABLES FOR CUSTOM AUTH
-- Run this in Supabase SQL Editor
-- ===================================================

-- Step 1: Drop ALL existing policies on customers table
DROP POLICY IF EXISTS "Allow anon to select by phone" ON public.customers;
DROP POLICY IF EXISTS "Allow anon to insert customers" ON public.customers;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.customers;
DROP POLICY IF EXISTS "public read customers" ON public.customers;
DROP POLICY IF EXISTS "allow public to select customers" ON public.customers;
DROP POLICY IF EXISTS "allow authenticated to select own customer" ON public.customers;

-- Step 2: Drop ALL existing policies on orders table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.orders;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.orders;

-- Step 3: Drop ALL existing policies on order_items table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.order_items;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.order_items;

-- Step 4: Drop ALL existing policies on menu_schedules table
DROP POLICY IF EXISTS "public read schedules" ON public.menu_schedules;

-- Step 5: DISABLE RLS on all tables for MVP
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_schedules DISABLE ROW LEVEL SECURITY;

-- Step 6: Verify the fix
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('customers', 'orders', 'order_items', 'menu_schedules')
  AND schemaname = 'public'
ORDER BY tablename;

-- Should show:
-- customers      | f
-- menu_schedules | f
-- order_items    | f
-- orders         | f
-- (f = false = RLS disabled ✅)
