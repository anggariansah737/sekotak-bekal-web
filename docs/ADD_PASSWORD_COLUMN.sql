-- Add password_hash column to customers table
-- Run this in Supabase SQL Editor

ALTER TABLE public.customers ADD COLUMN password_hash TEXT;

-- Verify the column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;
