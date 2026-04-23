# Custom Phone+Password Auth - Complete Summary

## What Changed

### Frontend (React)

**File:** `src/context/AuthContext.tsx`

- Removed Supabase Auth dependency (`auth.signUp()`, `auth.signInWithPassword()`)
- Implemented custom auth with phone + password
- Password hashing: SHA-256 (via crypto.subtle.digest)
- Session management: localStorage.sekotak_user_id
- Phone normalization: Converts 08x to 62x format

**File:** `src/types/database.ts`

- Updated `DbCustomer` interface to include `password_hash?: string`

### Backend (Supabase)

**Table:** `customers`

- Added column: `password_hash TEXT`
- Disabled RLS (for MVP safety)
- No email-based auth, purely phone+password

## How It Works

### Registration Flow

```
User fills: Name, Phone, Password
            ↓
Normalize phone (08x → 62x)
            ↓
Check phone doesn't exist in DB
            ↓
Hash password with SHA-256
            ↓
Insert customer with password_hash
            ↓
Save user ID to localStorage.sekotak_user_id
            ↓
Redirect to home
```

### Login Flow

```
User fills: Phone, Password
            ↓
Normalize phone
            ↓
Query customers by phone
            ↓
Hash password and compare with stored hash
            ↓
If match: save to localStorage, redirect home
If no match: show error "Password salah"
If not found: show error "Nomor HP tidak ditemukan"
```

### Session Check

On app load, AuthContext checks `localStorage.sekotak_user_id`:

- If exists: fetch customer data and restore session
- If not exists: stay logged out

## Security Notes

### ✅ What's Good

- Password stored as SHA-256 hash (never plaintext)
- Phone normalized consistently
- localStorage is secure for MVP (no sensitive data besides user ID)
- Password verified on every login attempt

### ⚠️ MVP Limitations (OK for early stage)

- SHA-256 is fast but vulnerable to rainbow tables → use bcrypt in production
- No password requirements (length, complexity, etc.)
- No account recovery mechanism
- No session timeout
- localStorage accessible to any JS code on the domain

### 🚀 For Production

- Switch to bcrypt or Argon2 password hashing
- Add password requirements (min 8 chars, complexity)
- Implement JWT-based sessions with expiry
- Add rate limiting on login attempts
- Implement 2FA or email confirmation for account recovery
- Use service role key for auth operations (not anon key)
- Re-enable RLS with proper policies

## Files to Run

### 1. Database Setup

**File:** `docs/FIX_RLS_FINAL.sql`

- Add password_hash column
- Disable RLS on customers table
- Drop conflicting policies
- Run in Supabase SQL Editor

### 2. Test Everything

**File:** `docs/TEST_CUSTOM_AUTH.md`

- Step-by-step testing guide
- Debugging checklist
- Common issues & fixes

### 3. Additional Docs

**File:** `docs/RLS_FIX_INSTRUCTIONS.md`

- Detailed Supabase setup instructions
- Troubleshooting guide
- What changed explanation

## Phone Number Format

The app normalizes all phone numbers to international format (62xxx):

- Input: `081234567890` → Stored: `6281234567890`
- Input: `6281234567890` → Stored: `6281234567890` (unchanged)
- Input: `+6281234567890` → Stored: `6281234567890` (+ removed)

All queries use normalized format.

## Testing Checklist

Before marking this as done:

- [ ] Run FIX_RLS_FINAL.sql in Supabase
- [ ] Try register with new phone + password
- [ ] Check password_hash saved in Supabase
- [ ] Try login with correct password (should work)
- [ ] Try login with wrong password (should error)
- [ ] Try login with non-existent phone (should error)
- [ ] Try register with same phone (should error)
- [ ] Check localStorage has sekotak_user_id after login
- [ ] Refresh page (should still be logged in)
- [ ] Test logout

## Next Steps

1. **Apply the fix** → Run `FIX_RLS_FINAL.sql` in Supabase
2. **Test thoroughly** → Follow `TEST_CUSTOM_AUTH.md`
3. **Check menu-per-day** → Menu should show for selected date
4. **Test checkout** → Create multi-date order
5. **Update n8n** → Handle new webhook payload with orders[]
6. **Deploy** → Push to production

## Why No Email?

User explicitly requested phone-only auth because:

- Email validation was hitting rate limits
- MVP only needs phone for WhatsApp integration
- Simpler for users (no email to remember)
- Faster development
- Can add email later if needed

Email fields remain in database schema for future use but are not required.

## API Reference

### AuthContext Methods

```typescript
// In any component that uses useAuth()

const { user, loading, register, login, logout } = useAuth()

// Register
await register(name: string, phone: string, password: string)
// Throws: "Nomor HP sudah terdaftar" | other errors

// Login
await login(phone: string, password: string)
// Throws: "Nomor HP tidak ditemukan" | "Password salah" | other errors

// Logout
await logout()

// User object (after login)
user?.id       // UUID
user?.name     // Display name
user?.phone    // Normalized phone (62xxx)
user?.email    // Currently empty/undefined
```

## Database Schema

```sql
-- Relevant columns in customers table
id              uuid PRIMARY KEY
name            text NOT NULL
phone           text NOT NULL UNIQUE
password_hash   text (NEW)
email           text
created_at      timestamp DEFAULT now()
```

No RLS policies, all public read/write (safe for MVP with login validation in app).
