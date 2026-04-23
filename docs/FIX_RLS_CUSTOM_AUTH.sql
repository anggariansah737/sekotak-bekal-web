-- Fix RLS for Custom Auth (Phone + Password)
-- Run this in Supabase SQL Editor

-- Enable RLS on customers table
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous to query customers by phone (for login)
CREATE POLICY "Allow anon to select by phone"
ON public.customers
FOR SELECT
TO anon
USING (true);

-- Policy 2: Allow anonymous to insert customers (for registration)
CREATE POLICY "Allow anon to insert customers"
ON public.customers
FOR INSERT
TO anon
WITH CHECK (true);

-- Policy 3: Allow authenticated users to update their own profile
CREATE POLICY "Allow users to update own profile"
ON public.customers
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, qual
FROM pg_policies
WHERE tablename = 'customers'
ORDER BY policyname;
