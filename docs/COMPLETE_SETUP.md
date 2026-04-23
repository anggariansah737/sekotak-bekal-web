# Complete Setup Guide - Sekotak Bekal MVP

This guide walks you through the entire setup from scratch to a working app with:

- ✅ Menu-per-day feature (7-day lookahead)
- ✅ Custom phone+password authentication
- ✅ Multi-day cart with delivery dates
- ✅ n8n webhook integration

**Estimated time:** 45-60 minutes depending on experience

---

## Phase 1: Database Setup (10 minutes)

### Step 1: Prepare RLS Fix

1. Copy the entire content from: `docs/FIX_RLS_FINAL.sql`

2. Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Click "SQL Editor" in left sidebar
   - Click "+ New Query"

3. Paste the SQL and run it
   - Click blue "Run" button (or Cmd+Enter)
   - Should see success messages with no errors

4. Verify RLS is disabled
   - Go to Table Editor
   - Click `customers` table
   - Click ⚙️ icon
   - Verify "Enable RLS" toggle is OFF

✅ Status: RLS disabled, password_hash column added

---

## Phase 2: Add Menu Schedule Data (5 minutes)

### Step 1: Prepare Menu Data

1. Copy the entire content from: `docs/PASTE_TO_SUPABASE.sql`
   - Contains 6 menu items scheduled for dates 2026-04-24 to 2026-04-30

2. In Supabase SQL Editor, create a new query
   - Click "+ New Query"
   - Paste the SQL

3. Run it (Cmd+Enter or click Run)
   - Should see "INSERT" message showing rows inserted

4. Verify data
   - Run this verification query:
     ```sql
     SELECT available_date, COUNT(*) as menu_count
     FROM public.menu_schedules
     WHERE available_date >= '2026-04-24'
     GROUP BY available_date
     ORDER BY available_date;
     ```
   - Should show 6 dates with menu counts: 6, 3, 3, 2, 3, 2, 2

✅ Status: Menu schedule data ready for testing

---

## Phase 3: Frontend Development (20 minutes)

### Step 1: Install Dependencies

```bash
cd sekotak-bekal-web
npm install
```

### Step 2: Check Environment Variables

Open `.env` and verify:

```
VITE_SUPABASE_URL=https://foicodenxgbbgwgnrkez.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_N8N_WEBHOOK_URL=https://n8n-bahyqrvsn7n0.terong.sumopod.my.id/webhook/sekotak-order
```

### Step 3: Start Development Server

```bash
npm run dev
```

Output should show:

```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser

- Open http://localhost:5173
- Should see homepage with date carousel

✅ Status: App running locally

---

## Phase 4: Test Authentication (15 minutes)

### Step 1: Test Registration

**Go to register page:**

1. Click "Daftar" button (or add `/register` to URL)
2. Fill form:
   - Name: `Budi Santoso`
   - Phone: `085648444086` (or similar)
   - Password: `password123`
3. Click "Daftar"
4. Should see success message and redirect to home

**Verify in Supabase:**

- Go to Supabase → Table Editor → customers
- Should see new row with:
  - name: "Budi Santoso"
  - phone: "62856484440086" (normalized)
  - password_hash: (64-character hex string)

### Step 2: Test Login

1. Click logout (if available)
2. Click "Masuk" button
3. Fill form:
   - Phone: `085648444086` (same as registered)
   - Password: `password123` (same as registered)
4. Click "Masuk"
5. Should see success and redirect to home
6. Should see user name in header

### Step 3: Test Wrong Password

1. Click logout
2. Fill login form:
   - Phone: `085648444086`
   - Password: `wrongpassword`
3. Should see error: "Password salah"
4. Should NOT redirect

### Step 4: Test Non-existent Phone

1. Fill login form:
   - Phone: `081234567890` (doesn't exist)
   - Password: anything
2. Should see error: "Nomor HP tidak ditemukan"

✅ Status: Authentication working correctly

---

## Phase 5: Test Menu-Per-Day Feature (15 minutes)

### Step 1: Check Menu Display

1. Stay logged in
2. On homepage, look for date carousel at top
3. Should show dates like:
   - Kamis, 24 April
   - Jumat, 25 April
   - etc.

4. Click each date
5. Menu items should change based on date
6. Check browser console - should see in Network tab:
   - GET request to menu_schedules table with `available_date=eq.2026-04-24`
   - Should return 6 items for April 24, 3 items for April 25, etc.

### Step 2: Test Add to Cart

1. Stay on April 24 (has 6 items)
2. Click "Tambah" on first item
3. Toast message should show: "Ayam Bakar Madu ditambahkan" (with date)
4. Switch to April 25
5. Click "Tambah" on first item for that day
6. Toast should show: "Ayam Bakar Madu ditambahkan" (with different date)

### Step 3: Check Cart

1. Click cart icon (🛒)
2. Should show 2 sections:
   - 📅 Kamis, 24 April (with items from April 24)
   - 📅 Jumat, 25 April (with items from April 25)
3. Each section should show correct subtotal
4. Total should be sum of both

### Step 4: Test Checkout

1. Click "Konfirmasi Pesanan" button
2. Should see success message
3. Verify in Supabase → Table Editor:
   - Go to `orders` table
   - Should see 2 new orders:
     - Order 1: delivery_date = 2026-04-24
     - Order 2: delivery_date = 2026-04-25
   - Both should have same customer_id (your user)
4. Go to `order_items` table
   - Should see items linked to both orders

✅ Status: Menu-per-day feature working correctly

---

## Phase 6: Update n8n Workflow (10 minutes)

### Step 1: Access n8n

1. Go to n8n dashboard: https://n8n-bahyqrvsn7n0.terong.sumopod.my.id
2. Login with your credentials
3. Navigate to Workflows
4. Find workflow ID: `hjKwIjmuzvwgK9Xq`

### Step 2: Review Webhook Payload

The app now sends webhook with format:

```json
{
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [...],
      "subtotal": 28000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [...],
      "subtotal": 35000
    }
  ],
  "totalAmount": 63000,
  "customer": {...}
}
```

### Step 3: Update n8n Nodes

Follow one of these guides:

- **Quick path:** `docs/N8N_QUICK_CHEAT.md` (5 min for experienced)
- **Detailed path:** `docs/N8N_STEP_BY_STEP.md` (20 min for beginners)

Key changes:

- Parse `orders[]` array instead of single order
- Loop through each order to process separately
- Send one WhatsApp per delivery date (or combine in message)

### Step 4: Test Webhook

1. Go back to app
2. Create another multi-date order (April 24 + April 25 items)
3. Go to n8n → Executions
4. Should see new execution with green checkmark
5. Check WhatsApp - should receive message(s)

✅ Status: n8n webhook working with new payload format

---

## Phase 7: Production Checklist (5 minutes)

Before deploying, verify:

### Database

- [ ] Customers table has no RLS (or proper policies)
- [ ] password_hash column exists
- [ ] menu_schedules table has data
- [ ] orders table has delivery_date column

### Frontend

- [ ] Register/login working
- [ ] Menu shows for selected dates
- [ ] Cart groups by delivery date
- [ ] Checkout creates multiple orders
- [ ] Orders page shows delivery dates

### n8n

- [ ] Webhook receives new payload format
- [ ] Handles orders[] array correctly
- [ ] WhatsApp messages sent for each order

### Environment

- [ ] .env has correct Supabase URL & key
- [ ] .env has correct n8n webhook URL
- [ ] No console errors in browser DevTools

---

## Troubleshooting

### Registration/Login Not Working

**Error:** 406 Not Acceptable

- [ ] Check RLS is disabled: Supabase → Table Editor → customers → ⚙️ → RLS OFF
- [ ] Hard refresh browser: Cmd+Shift+R
- [ ] Clear localStorage: DevTools → Console → `localStorage.clear()`

### Menu Not Showing

**Error:** Empty menu list

- [ ] Check menu_schedules has data: Supabase → Table Editor
- [ ] Check selected date matches data (April 24-30)
- [ ] Check browser Network tab for query response

### Cart Shows Wrong Items

**Error:** Items from wrong date showing together

- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Refresh page: Cmd+R
- [ ] Check cart grouping logic in cart.tsx

### Checkout Not Creating Multiple Orders

**Error:** Only 1 order created instead of 2+

- [ ] Check items really have different dates
- [ ] Check console for JavaScript errors
- [ ] Verify orders table has delivery_date column

### Webhook Not Triggering

**Error:** No new execution in n8n

- [ ] Check VITE_N8N_WEBHOOK_URL is correct in .env
- [ ] Check n8n workflow has webhook trigger enabled
- [ ] Check n8n network connectivity
- [ ] Look at browser Network tab to see if webhook POST successful

---

## Quick Command Reference

```bash
# Start app
npm run dev

# Build for production
npm run build

# Type check
npm run check:types

# Format code
npm run format

# Lint
npm run lint
```

---

## Success Criteria

✅ App is fully functional when ALL of these pass:

1. **Auth**
   - Can register with phone + password
   - Can login with correct credentials
   - Get error with wrong password
   - localStorage persists session

2. **Menu Per-Day**
   - Menu changes when selecting different dates
   - Can add items from different dates
   - Cart shows separate sections per date

3. **Checkout**
   - Creates 1 order per delivery_date
   - All orders in database with correct delivery_date
   - order_items linked to correct orders

4. **Integration**
   - n8n receives webhook with orders[] array
   - Webhook processing works without errors
   - WhatsApp messages sent to customer

---

## Next Steps

1. ✅ Setup complete
2. Test thoroughly with real data
3. Customize messages/templates
4. Build admin panel for menu management
5. Deploy to production

---

## Support

If stuck on any phase:

1. Check relevant documentation file
2. Look at troubleshooting section above
3. Check browser console for errors
4. Check Supabase dashboard for data
5. Check n8n execution logs for webhook errors

Happy coding! 🚀
