# Quick Reference Card

Print this and keep it by your desk while setting up.

---

## 🚀 Setup in 60 Seconds

1. **Supabase:** Run `FIX_RLS_FINAL.sql` → Paste SQL → Click Run ✅
2. **Supabase:** Run `PASTE_TO_SUPABASE.sql` → Paste SQL → Click Run ✅
3. **Terminal:** `npm run dev` in `sekotak-bekal-web` folder ✅
4. **Browser:** Go to http://localhost:5173 ✅
5. **Test:** Register → Login → Add items to cart → Checkout ✅

---

## 📁 Key Files

| File                  | What                 | Where          |
| --------------------- | -------------------- | -------------- |
| AuthContext.tsx       | Login/Register logic | `src/context/` |
| use-cart.ts           | Cart management      | `src/hooks/`   |
| use-menu.ts           | Menu by date         | `src/hooks/`   |
| cart.tsx              | Cart UI              | `src/routes/`  |
| index.tsx             | Homepage             | `src/routes/`  |
| FIX_RLS_FINAL.sql     | Database setup       | `docs/`        |
| PASTE_TO_SUPABASE.sql | Menu data            | `docs/`        |

---

## 🔐 Authentication

**Phone Normalization:**

- `08x...` → `62x...`
- `62x...` → `62x...` (unchanged)
- `+62x...` → `62x...`

**Password Hashing:**

- Algorithm: SHA-256
- Stored: 64-char hex string
- Verified: on every login

**Session:**

- Storage: localStorage
- Key: `sekotak_user_id`
- Format: UUID string

---

## 📅 Menu Per-Day

**Table:** `menu_schedules`

- Columns: id, menu_item_id, available_date
- One menu can appear on multiple dates
- One date can have multiple menus
- 7-day lookahead from today

**Cart Structure:**

```typescript
interface CartLine {
  id: string; // menu_item_id
  date: string; // '2026-04-24'
  qty: number; // quantity
}
```

**Order Creation:**

- 1 order per unique delivery_date
- All orders created in single transaction
- order_items linked to correct order_id

---

## 🛒 Cart Flow

```
User selects date → sees menu for that date
               ↓
       Clicks "Tambah"
               ↓
   Item added with date to cart
               ↓
  Can add items from multiple dates
               ↓
    Cart groups items by date
               ↓
      Click "Konfirmasi"
               ↓
  Creates 1 order per delivery_date
               ↓
    Sends webhook to n8n with orders[]
```

---

## 🔗 n8n Webhook

**Old Format (Single Order):**

```json
{
  "orderId": "...",
  "items": [...],
  "totalAmount": 63000
}
```

**New Format (Multiple Orders):**

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

**n8n Changes:**

- Parse `orders[]` array
- Loop through each order
- Handle each delivery_date separately

---

## ⚡ Common Commands

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Type check
npm run check:types

# Check code quality
npm run lint

# Format code
npm run format

# Clear cache
rm -rf node_modules .vite
npm install
```

---

## 🐛 Debugging Checklist

**No register/login working?**

- [ ] Run FIX_RLS_FINAL.sql
- [ ] Check RLS OFF in Supabase
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Clear localStorage: `localStorage.clear()`

**Menu not showing for date?**

- [ ] Check PASTE_TO_SUPABASE.sql ran successfully
- [ ] Verify menu_schedules has data for that date
- [ ] Check browser Network tab for query
- [ ] Check console for JavaScript errors

**Checkout not working?**

- [ ] Make sure items have different dates in cart
- [ ] Check browser console for errors
- [ ] Check Supabase orders table for new rows
- [ ] Verify delivery_date column exists

**Webhook not triggering?**

- [ ] Check VITE_N8N_WEBHOOK_URL in .env
- [ ] Verify n8n webhook trigger is active
- [ ] Check browser Network tab → XHR
- [ ] Look for POST to n8n URL in requests

---

## 📊 Database Schema (Relevant Parts)

```sql
-- customers (authentication)
id              uuid PRIMARY KEY
name            text
phone           text UNIQUE
password_hash   text ← NEW
email           text
created_at      timestamp

-- menu_items (menus)
id              uuid PRIMARY KEY
name            text
price           number
category        text
is_available    boolean
created_at      timestamp

-- menu_schedules (dates) ← NEW
id              uuid PRIMARY KEY
menu_item_id    uuid → menu_items(id)
available_date  date
created_at      timestamp

-- orders (purchases)
id              uuid PRIMARY KEY
customer_id     uuid → customers(id)
total_amount    number
delivery_date   date ← NEW
status          text
created_at      timestamp

-- order_items (line items)
id              uuid PRIMARY KEY
order_id        uuid → orders(id)
menu_item_id    uuid → menu_items(id)
quantity        number
price           number
```

---

## 🌐 URLs & Keys

```
Supabase:   https://app.supabase.com
n8n:        https://n8n-bahyqrvsn7n0.terong.sumopod.my.id
App Dev:    http://localhost:5173
n8n Webhook: https://n8n-bahyqrvsn7n0.terong.sumopod.my.id/webhook/sekotak-order

Workflow ID: hjKwIjmuzvwgK9Xq
Project ID:  foicodenxgbbgwgnrkez
```

---

## 📝 Phone Numbers for Testing

Use these to test (they're not real):

- `085648444086` → `62856484440086`
- `082345678901` → `62823456789001`
- `081234567890` → `62812345678900`

All need unique passwords (e.g., `test123`, `password456`, etc.)

---

## ✅ Success Checklist

Before going to production:

- [ ] RLS disabled on customers
- [ ] password_hash column exists
- [ ] menu_schedules has test data (April 24-30)
- [ ] Register new user successfully
- [ ] Login with that user successfully
- [ ] Wrong password shows error
- [ ] Non-existent phone shows error
- [ ] Add items from multiple dates
- [ ] Cart shows separate sections per date
- [ ] Checkout creates multiple orders
- [ ] Each order has correct delivery_date
- [ ] n8n webhook triggers on order
- [ ] n8n correctly parses orders[] array

---

## 🚨 If Everything Breaks

```bash
# In terminal:
cd sekotak-bekal-web

# Kill dev server (Ctrl+C)

# Clean and reinstall
rm -rf node_modules .vite
npm install

# Restart
npm run dev

# In browser:
# 1. Hard refresh: Cmd+Shift+R
# 2. Clear localStorage: DevTools → Console → localStorage.clear()
# 3. Close DevTools
# 4. Refresh page

# Check Supabase:
# 1. Table Editor → customers → Verify has data
# 2. Check RLS toggle is OFF
# 3. Run: SELECT * FROM customers LIMIT 1;
```

---

## 📞 Support

**Contact:**

- Email: angga.riansah332@gmail.com
- Docs: See `docs/` folder
- Code: Check `src/` folder

**Docs Map:**

```
docs/
├── INDEX.md                  ← Start here
├── COMPLETE_SETUP.md         ← Full setup guide
├── CUSTOM_AUTH_SUMMARY.md    ← Auth overview
├── FIX_RLS_FINAL.sql         ← Run this first
├── RLS_FIX_INSTRUCTIONS.md   ← Supabase setup
├── TEST_CUSTOM_AUTH.md       ← Test everything
├── QUICK_REFERENCE.md        ← You are here
└── [Other docs...]
```

---

**Happy coding! 🚀**
