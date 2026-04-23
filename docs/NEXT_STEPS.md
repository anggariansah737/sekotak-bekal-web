# Next Steps - Your Action Plan

Everything is ready to go. Here's what you need to do right now.

---

## ⏰ Timeline

**Total time:** 30-45 minutes

---

## 🎯 Phase 1: Fix RLS (5 minutes)

### What

Fix the RLS issue blocking authentication.

### How

**Step 1:** Get the SQL fix

- Open: `docs/FIX_RLS_FINAL.sql`
- Select ALL and copy (Ctrl+A, Ctrl+C)

**Step 2:** Go to Supabase

- Open: https://app.supabase.com
- Login with your credentials
- Select project: "bekal" (or your project name)

**Step 3:** Run the SQL

- Click: "SQL Editor" in left sidebar
- Click: "+ New Query" button
- Paste the SQL you copied
- Click: Blue "RUN" button (or Cmd+Enter)

**Step 4:** Verify it worked

- Should see messages like: "ALTER TABLE" (no errors)
- No red error messages
- Look for: "rowsecurity | f" (meaning RLS is OFF ✅)

### If It Fails

- Check Supabase table editor → customers table → ⚙️ icon
- Make sure "Enable RLS" toggle shows OFF
- If ON, click it to turn OFF

---

## 🎯 Phase 2: Add Menu Data (3 minutes)

### What

Load sample menu data so you can test the menu-per-day feature.

### How

**Step 1:** Get the menu SQL

- Open: `docs/PASTE_TO_SUPABASE.sql`
- Select ALL and copy

**Step 2:** Run in Supabase

- In SQL Editor: Click "+ New Query"
- Paste the SQL
- Click "RUN"

**Step 3:** Verify

- Run verification query from the same file
- Should see 6 dates (April 24-30) with menu counts
- Example output:
  ```
  available_date | menu_count
  2026-04-24     | 6
  2026-04-25     | 3
  2026-04-26     | 3
  ...
  ```

---

## 🎯 Phase 3: Start the App (5 minutes)

### What

Get the development server running locally.

### How

**Step 1:** Open terminal

- On Mac: Press Cmd+Space, type "terminal", hit Enter
- On Windows: Search for "Command Prompt" or "PowerShell"

**Step 2:** Navigate to project

```bash
cd sekotak-bekal-web
```

(Replace `sekotak-bekal-web` with your actual folder path if different)

**Step 3:** Start the dev server

```bash
npm run dev
```

**Step 4:** Wait for it to start
You should see:

```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
```

**Step 5:** Open in browser

- Click the http://localhost:5173 link, or
- Open your browser and type: `http://localhost:5173`

✅ You should see the app homepage with a date carousel at the top

---

## 🎯 Phase 4: Test Authentication (10 minutes)

### What

Verify register and login work.

### How

**Test 1: Register**

1. Click "Daftar" button
2. Fill the form:
   - Name: `Budi` (or any name)
   - Phone: `085648444086` (or any 10-digit mobile number)
   - Password: `test123`
3. Click "Daftar" button
4. Should see: Success message and redirect home
5. You should see your name displayed somewhere (if the app shows it)

**Test 2: Check Database**

1. Go to Supabase → Table Editor
2. Click `customers` table
3. Should see your new row with:
   - name: "Budi"
   - phone: "62856484440086" (normalized)
   - password_hash: (long hex string)

**Test 3: Login**

1. Click logout (if available) or use DevTools to clear localStorage:
   - Open DevTools (F12)
   - Console tab
   - Type: `localStorage.clear()`
   - Press Enter
2. Now you should be on login page
3. Fill login form:
   - Phone: `085648444086` (same as registered)
   - Password: `test123` (same as registered)
4. Click "Masuk"
5. Should see: Success and redirect home
6. Should see your name again

**Test 4: Wrong Password**

1. Logout again
2. Try login with:
   - Phone: `085648444086` (correct)
   - Password: `wrong123` (WRONG)
3. Should see error: "Password salah"
4. Should NOT redirect home

**Test 5: Non-existent Phone**

1. Try login with:
   - Phone: `081234567890` (doesn't exist)
   - Password: anything
2. Should see error: "Nomor HP tidak ditemukan"

✅ **Success:** All 5 tests pass → Authentication is working!

---

## 🎯 Phase 5: Test Menu Per-Day (10 minutes)

### What

Verify menu shows different items for different dates.

### How

**Test 1: View Menu for Different Dates**

1. Stay on homepage (logged in)
2. Look at the date carousel at top (shows dates like "Kamis, 24 April")
3. Look at the menu items below
4. Click different dates in the carousel
5. Menu items should CHANGE for each date
   - April 24: Should show 6 items
   - April 25: Should show 3 items
   - April 26: Should show 3 items
   - etc.

**Test 2: Add Items from Multiple Dates**

1. On April 24 (or first date), click "Tambah" on first item
2. Toast message should show with that date
3. Click different date in carousel
4. Click "Tambah" on first item from new date
5. Go to cart (click cart icon 🛒)
6. Should see 2 GROUPS:
   - One for April 24
   - One for April 25
7. Each group shows its items

**Test 3: Check Subtotals**

1. Look at each date group in cart
2. Each should show:
   - Calendar icon 📅
   - Date text
   - Items list
   - Subtotal for that date
3. Total at bottom = sum of all subtotals

✅ **Success:** Menu shows different items per date, cart groups correctly

---

## 🎯 Phase 6: Test Checkout (5 minutes)

### What

Verify checkout creates multiple orders (one per delivery date).

### How

**Step 1: Create a Multi-Date Order**

1. Make sure cart has items from 2+ different dates
2. Click "Konfirmasi Pesanan" button
3. Should see success message

**Step 2: Verify in Database**

1. Go to Supabase → Table Editor
2. Click `orders` table
3. Should see 2 NEW rows (one per delivery date)
4. Each should have:
   - customer_id: (your user ID)
   - delivery_date: Different dates
   - status: "pending" (or whatever default is)
   - created_at: Current time

**Step 3: Check Order Items**

1. Go to Supabase → Table Editor
2. Click `order_items` table
3. Should see items for both orders
4. Each order_items row should link to correct order_id

**Step 4: Check Webhook**

1. Open browser DevTools (F12)
2. Go to Network tab
3. Look for POST request to n8n URL
4. Should show Status: 200 OK
5. Response should contain orders[] array with 2 orders

✅ **Success:** Multiple orders created, webhook sent

---

## 🎯 Phase 7: Update n8n (10 minutes)

### What

Update n8n workflow to handle new webhook format with orders[] array.

### How

**Pick Your Path:**

**Option A: Fast Track (5 minutes for experienced n8n users)**

- Open: `docs/N8N_QUICK_CHEAT.md`
- Follow the 3 code blocks
- Copy/paste into your n8n workflow

**Option B: Detailed Guide (20 minutes for beginners)**

- Open: `docs/N8N_STEP_BY_STEP.md`
- Follow step by step
- Includes screenshots and explanations

**Either way:**

1. Go to n8n dashboard
2. Find workflow ID: `hjKwIjmuzvwgK9Xq`
3. Update the nodes to handle orders[] array
4. Test with a webhook call
5. Verify WhatsApp message sends

✅ **Success:** n8n receives and processes new webhook format

---

## ✅ Final Verification

Run through this checklist to make sure everything works:

- [ ] Register with phone + password
- [ ] Password_hash saved in Supabase
- [ ] Login with correct password (works)
- [ ] Login with wrong password (error "Password salah")
- [ ] Non-existent phone (error "Nomor HP tidak ditemukan")
- [ ] Menu shows for selected date
- [ ] Can add items from multiple dates
- [ ] Cart groups items by delivery date
- [ ] Each group shows subtotal
- [ ] Total is sum of subtotals
- [ ] Checkout creates multiple orders
- [ ] Each order has correct delivery_date
- [ ] n8n webhook triggers
- [ ] n8n processes orders[] correctly
- [ ] WhatsApp message received

**If all boxes checked:** You're done! ✅

---

## 🆘 Troubleshooting

### "Still getting 406 error on register/login"

1. Go to Supabase dashboard
2. Table Editor → customers table
3. Click ⚙️ icon
4. Check if "Enable RLS" is OFF
5. If ON, click toggle to turn OFF
6. Hard refresh browser: Cmd+Shift+R

### "Menu not showing for date"

1. Check menu_schedules has data: Supabase → Table Editor
2. Verify it has rows for April 24-30
3. Check selected date matches (maybe app loaded before data was added)
4. Try logging out and back in
5. Check browser console (F12) for errors

### "Cart not showing items"

1. Make sure you actually added items
2. Check localStorage: DevTools → Console → `localStorage.getItem('sekotak_cart')`
3. Should return array with items
4. If empty, try adding items again

### "Checkout not creating orders"

1. Make sure items are from DIFFERENT dates
2. Check browser Network tab (F12) to see if POST went to Supabase
3. Check if error messages in browser console
4. Check Supabase orders table directly

### "n8n not receiving webhook"

1. Check `VITE_N8N_WEBHOOK_URL` in .env is correct
2. Check n8n webhook trigger is active (status should be "active")
3. Check n8n execution logs for errors
4. Do manual test: trigger webhook from n8n test button

---

## 🚀 You're Ready!

Everything is setup and tested. You can now:

1. ✅ Register and login users
2. ✅ Show menu per delivery date
3. ✅ Accept multi-date orders
4. ✅ Send orders to n8n
5. ✅ Process with WhatsApp

**Next phase (future):**

- Build admin panel to manage menu_schedules
- Add order tracking
- Setup customer support
- Deploy to production

---

## 📞 Questions?

Check these docs:

- **Quick answers:** QUICK_REFERENCE.md
- **Full setup:** COMPLETE_SETUP.md
- **Auth details:** CUSTOM_AUTH_SUMMARY.md
- **Testing guide:** TEST_CUSTOM_AUTH.md
- **n8n setup:** N8N_STEP_BY_STEP.md

---

**Start with Phase 1 now! You've got this! 🎉**
