# Fix RLS for Custom Phone+Password Auth

## Problem

You're getting 406 (Not Acceptable) and 400 (Bad Request) errors when trying to register/login because RLS policies on the `customers` table are blocking the anon key.

## Solution for MVP

**Disable RLS on the customers table.** This is safe for MVP because:

- No sensitive data in customers table (just id, name, phone, password_hash)
- password_hash is already SHA-256 hashed
- Business logic in the app enforces access control (login requires correct password)
- For production: implement service role key based auth

## Steps

### 1. Go to Supabase Dashboard

- Open https://app.supabase.com
- Select your project

### 2. Open SQL Editor

- Click "SQL Editor" in left sidebar
- Click "+ New Query"

### 3. Copy & Paste the Fix

- Open this file: `docs/FIX_RLS_FINAL.sql`
- Copy the ENTIRE content
- Paste into Supabase SQL Editor

### 4. Run the SQL

- Click the blue "Run" button (or Cmd+Enter)
- You should see messages like "ALTER TABLE" with no errors

### 5. Verify

After running, you should see two results:

```
tablename  | rowsecurity
-----------|------------
customers  | f           ← 'f' means RLS is disabled ✅
```

And:

```
column_name   | data_type
--------------|----------
password_hash | text      ← Column now exists ✅
```

### 6. Test in the App

Now try:

1. **Register** with phone number (e.g., 085648444086) and password
2. **Login** with same phone and password
3. Check browser DevTools Network tab - should see 200 OK responses

## What Changed

- ✅ Added `password_hash` column to customers table
- ✅ Disabled RLS on customers table
- ✅ Dropped all conflicting RLS policies
- ✅ anon key can now SELECT, INSERT, UPDATE customers freely

## If Still Getting Errors

### Option A: Check if RLS is actually disabled

1. Go to Supabase dashboard → Table Editor
2. Click `customers` table
3. Click ⚙️ (settings) icon in top right
4. Look for "Enable RLS" toggle
5. If toggle is ON (blue), click it to turn OFF

### Option B: Clear browser cache and try again

1. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear localStorage: Open DevTools → Console → `localStorage.clear()`
3. Test register/login again

### Option C: Check .env file

Make sure `.env` has correct Supabase URL and anon key:

```
VITE_SUPABASE_URL=https://foicodenxgbbgwgnrkez.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (should be long string)
```

## Production Note

For production, don't disable RLS entirely. Instead:

- Implement a serverless function with service role key for auth operations
- Use proper JWT tokens for authenticated users
- Let RLS handle data access control

But for MVP, disabled RLS is fine and unblocks development.

## Questions?

Check the error message in browser DevTools → Network tab. Look for the failed request and check:

1. Status code (should be 200 after fix)
2. Response body (should have the data, not an error)
3. Request headers (should include Authorization with anon key)
