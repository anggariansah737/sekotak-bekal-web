# Test Custom Phone+Password Auth

## Prerequisites

- ✅ RLS is disabled on customers table (run FIX_RLS_FINAL.sql)
- ✅ password_hash column exists
- ✅ App is running locally (npm run dev)
- ✅ Browser DevTools open (F12)

## Test Scenario

### Part 1: Register New User

**Step 1: Go to Register Page**

- Open http://localhost:5173
- Click "Daftar" button (or navigate to /register)

**Step 2: Fill Registration Form**

- Name: `Budi Santoso`
- Phone: `085648444086` (or any valid number)
- Password: `password123`
- Click "Daftar" button

**Step 3: Check Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Look for the POST request to customers table
4. Expected:
   ```
   POST /rest/v1/customers?select=*
   Status: 201 Created ✅
   Response: { id, name, phone, created_at } (no password_hash returned)
   ```

**Step 4: Verify Success**

- Should see success message: "Registrasi berhasil"
- Should redirect to home page
- Should see user name in header (if exists)

**Step 5: Check localStorage**

1. Open DevTools → Console
2. Run: `localStorage.getItem('sekotak_user_id')`
3. Should return a UUID like: `"12345678-1234-1234-1234-123456789012"`

---

### Part 2: Login

**Step 1: Logout First**

- Click logout button (if available)
- Or manually clear: `localStorage.removeItem('sekotak_user_id')`

**Step 2: Go to Login Page**

- Should redirect to /login automatically
- Or click "Masuk" button

**Step 3: Fill Login Form**

- Phone: `085648444086` (same as registered)
- Password: `password123` (same as registered)
- Click "Masuk" button

**Step 4: Check Network Tab**

1. Look for GET request to customers table
2. Expected:
   ```
   GET /rest/v1/customers?select=*&phone=eq.62856484440086
   Status: 200 OK ✅
   Response: { id, name, phone, created_at } (password_hash included but not shown in UI)
   ```

**Step 5: Verify Success**

- Should see success message: "Login berhasil"
- Should redirect to home page
- Should see user name in header

**Step 6: Check localStorage**

- Same user ID as before

---

### Part 3: Wrong Password

**Step 1: Try Login with Wrong Password**

- Phone: `085648444086` (correct)
- Password: `wrongpassword` (incorrect)
- Click "Masuk" button

**Step 2: Expected Error**

- Should see error: "Password salah"
- Should NOT redirect to home
- localStorage should be empty

---

### Part 4: User Not Found

**Step 1: Try Login with Non-existent Phone**

- Phone: `081234567890` (doesn't exist)
- Password: anything
- Click "Masuk" button

**Step 2: Expected Error**

- Should see error: "Nomor HP tidak ditemukan"
- Should NOT redirect to home

---

### Part 5: Duplicate Registration

**Step 1: Try Register with Same Phone**

- Name: `Different Name`
- Phone: `085648444086` (same as before)
- Password: `otherpassword`
- Click "Daftar" button

**Step 2: Expected Error**

- Should see error: "Nomor HP sudah terdaftar"
- Should NOT create new account

---

## Debugging Checklist

If any test fails, check:

### ❌ Still getting 406 error?

1. Open Supabase dashboard → Table Editor
2. Click `customers` table
3. Click ⚙️ icon
4. Verify "Enable RLS" is OFF
5. If ON, click to turn OFF
6. Refresh browser and try again

### ❌ Password mismatch but correct password used?

1. Check password_hash format in Supabase:
   - Go to Supabase dashboard → Table Editor
   - Click customers table
   - Should see hash like: `a3d5c8f...` (64 char hex)
2. Password hashing uses SHA-256 → should be deterministic
3. Try registering again with new phone

### ❌ Register succeeds but login fails?

1. Check if password_hash was saved:
   - Supabase dashboard → Query Editor
   - Run: `SELECT id, name, phone, password_hash FROM public.customers LIMIT 1;`
   - Should see password_hash value
2. If NULL, password_hash wasn't saved - check insert query in AuthContext

### ❌ localStorage.sekotak_user_id is undefined?

1. Registration/login succeeded but session not saved
2. Check console for errors
3. Check AuthContext.tsx line 76 (register) and 101 (login)

### ❌ Network shows 200 but still see error in UI?

1. Check browser console for JavaScript errors
2. Check response payload - should have customer object
3. Look at AuthContext.tsx error handling

---

## Success Criteria

✅ All tests pass when:

1. Register creates customer in DB with password_hash
2. Login retrieves customer and verifies password
3. localStorage stores user ID
4. Wrong password shows error
5. Non-existent user shows error
6. Duplicate registration shows error
7. No 406 or 400 errors in network tab

---

## Manual Database Check

If you want to verify data directly in Supabase:

1. Go to Supabase dashboard → Table Editor
2. Click `customers` table
3. Should see row with:
   - id: UUID
   - name: Your registration name
   - phone: Normalized number (62856484440086)
   - password_hash: 64-char hex string
   - created_at: timestamp

Example:

```
id                                   name         phone          password_hash                        created_at
12345678-1234-1234-1234-123456789012 Budi Santoso 62856484440086 a3d5c8f9e2b1... (64 chars)        2026-04-23 10:30:00+00
```

---

## Common Issues & Fixes

| Issue                | Check                              | Fix                                              |
| -------------------- | ---------------------------------- | ------------------------------------------------ |
| "RLS not working"    | Supabase Table Editor → RLS toggle | Turn RLS OFF for customers                       |
| "Still 406 errors"   | Browser refresh, cache clear       | Hard refresh (Cmd+Shift+R), clear localStorage   |
| "Password wrong"     | Supabase → customers table         | Check password_hash column exists and has data   |
| "localStorage empty" | AuthContext register/login         | Check setUser() and localStorage.setItem() calls |
| "No response data"   | Network tab response               | Should see customer object, not empty object     |
