# Next Steps: Setup Custom Auth & Test System

Status: ✅ Branding complete (Sekotak Bekal logo + title updated)

---

## 📋 Checklist (Do These Now)

### Phase 1: Configure Supabase for Custom Auth (5 min)

Run these SQL commands in **Supabase → SQL Editor**:

1. **DISABLE_RLS.sql** — Disables row-level security on all tables
   - Path: `docs/DISABLE_RLS.sql`
   - What it does: Removes all RLS policies and disables RLS on customers, orders, order_items, menu_schedules
   - Why: Custom auth = app-layer access control (not DB-layer RLS)

2. **FIX_FK_CONSTRAINT.sql** — Removes foreign key to non-existent users table
   - Path: `docs/FIX_FK_CONSTRAINT.sql`
   - What it does: Drops `customers.id_fkey` constraint
   - Why: We're not using Supabase Auth (users table), so this constraint breaks our custom auth

**Steps:**
1. Go to https://app.supabase.com → Your Project → SQL Editor
2. Click "+ New Query"
3. Copy-paste entire DISABLE_RLS.sql
4. Click "Run"
5. Verify output shows all 4 tables with `rowsecurity = f` (false = disabled ✅)
6. Create another query with FIX_FK_CONSTRAINT.sql
7. Click "Run"
8. Query at bottom should return empty result (no FK constraints)

---

### Phase 2: Seed Menu Data (5 min)

Add test menu items to menu_schedules table:

1. Go to Supabase SQL Editor
2. Create new query
3. Copy-paste `docs/PASTE_TO_SUPABASE.sql`
4. Click "Run"

This adds menu items for dates 2026-04-24 and 2026-04-25 (next 2 days).

---

### Phase 3: Test Authentication End-to-End (10 min)

#### Test Register Flow:
1. Start dev server: `npm run dev`
2. Open http://localhost:5173 in browser
3. Click "Daftar" tab (currently showing)
4. Fill in:
   - **Nama Lengkap**: Sari Wulandari
   - **Nomor WhatsApp**: 0812345678 (any 08xxx format)
   - **Password**: test1234 (min 6 chars)
5. Click "Daftar Sekarang"
6. Expected:
   - ✅ Toast shows "Akun berhasil dibuat!"
   - ✅ Redirects to home page (/)
   - ✅ Header shows user name "Sari Wulandari"

#### Test Login Flow:
1. Click profile icon (bottom right)
2. Click "Keluar" button
3. Click "Masuk" link in auth card
4. Switch to "Masuk" tab
5. Fill in:
   - **Nomor WhatsApp**: 08123456789 (same as above)
   - **Password**: test1234
6. Click "Masuk"
7. Expected:
   - ✅ Toast shows "Berhasil masuk!"
   - ✅ Redirects to home page
   - ✅ Header shows same user name

#### Test Cart + Checkout:
1. Select tomorrow's date (April 25)
2. Add 2 items to cart
3. Go to cart
4. Verify items are grouped by delivery date
5. Click "Konfirmasi Pesanan"
6. Expected:
   - ✅ Creates orders in Supabase
   - ✅ Redirects to /orders
   - ✅ Shows new orders with delivery dates
   - ✅ n8n webhook gets triggered (check n8n dashboard)

---

### Phase 4: Update n8n Webhook Mappings (10 min)

The checkout creates a new webhook payload structure with `orders[]` array.

Your n8n workflow needs to map:
- ❌ OLD: `{{ $json.orderId }}`
- ✅ NEW: `{{ $json.orders[0].deliveryDate }}`

**Affected parameters:**
1. **Delivery Date** → `{{ $json.orders[0].deliveryDate }}`
2. **Items** → `{{ $json.orders[0].items }}`
3. **Subtotal** → `{{ $json.orders[0].subtotal }}`
4. **Total Amount** → `{{ $json.totalAmount }}`

Full reference: See `docs/N8N_CORRECT_MAPPING.md`

**Steps:**
1. Log in to n8n: https://n8n-bahyqrvsn7n0.terong.sumopod.my.id
2. Find your sekotak-order workflow
3. For each text field that references webhook data:
   - Update expressions from old structure to new
   - Test the webhook with "Test Trigger"
4. Verify WhatsApp message receives correct order data

---

## 🔍 Debugging Checklist

If something doesn't work:

### Authentication Errors:
- **"Cannot read property 'split'"** → RLS not disabled yet (run DISABLE_RLS.sql)
- **"Foreign key violation"** → FK constraint still exists (run FIX_FK_CONSTRAINT.sql)
- **"Email rate limit"** → This is fixed; we use phone+password now

### Cart/Checkout Errors:
- **Items not showing for date** → Menu schedules not seeded (run PASTE_TO_SUPABASE.sql)
- **Checkout creates wrong number of orders** → Check itemsByDate() logic in use-cart.ts
- **Webhook not triggered** → Check n8n webhook URL in .env (VITE_N8N_WEBHOOK_URL)

### n8n Webhook Issues:
- **"undefined" in WhatsApp message** → Parameters using old mapping (fix with N8N_CORRECT_MAPPING.md)
- **Webhook not receiving data** → Check browser DevTools Network tab, look for POST to n8n URL
- **Wrong order data** → Verify orders[] array structure in cart.tsx checkout function

---

## 📞 Quick Reference

**Key URLs:**
- App: http://localhost:5173
- Supabase: https://app.supabase.com
- n8n: https://n8n-bahyqrvsn7n0.terong.sumopod.my.id

**Key Files:**
- Auth system: `src/context/AuthContext.tsx`
- Cart logic: `src/hooks/use-cart.ts`
- Checkout: `src/routes/cart.tsx` (handleCheckout function)
- n8n payload: `src/lib/n8n.ts` (triggerOrderWebhook function)

---

## ✅ Definition of Done

You can move to the next phase when:

- [ ] DISABLE_RLS.sql executed successfully (all 4 tables show rowsecurity = f)
- [ ] FIX_FK_CONSTRAINT.sql executed (no FK constraints on customers table)
- [ ] PASTE_TO_SUPABASE.sql executed (menu items added for dates 24-25)
- [ ] Register → Login → Logout flow works end-to-end
- [ ] Cart shows items grouped by delivery date
- [ ] Checkout creates multiple orders (1 per delivery date) in Supabase
- [ ] n8n webhook receives new orders[] payload structure
- [ ] WhatsApp message to customer shows correct order details

---

## 🎯 After This

Once all tests pass, you can:

1. **Add more test data** for different dates via Supabase dashboard
2. **Build admin panel** to manage menu_schedules (add/remove menus per day)
3. **Go to production** with real customers + orders

Good luck! 🚀
