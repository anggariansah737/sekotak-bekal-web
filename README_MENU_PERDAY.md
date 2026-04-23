# Menu Per-Day Implementation ✅

## 📋 Status: READY FOR TESTING

All code implemented and building successfully. Just need to add sample data.

---

## 🚀 Quick Start (1 Minute)

### Step 1: Add Sample Data

Open **Supabase SQL Editor** and run the SQL from `docs/COPY_PASTE.txt`

### Step 2: Start App

```bash
npm run dev
```

### Step 3: Test

- Open http://localhost:5173
- Click different date buttons
- See different menus per date ✨

---

## 📖 What Was Built

### Feature: Order Items from Multiple Delivery Dates

**Before:**

```
Cart → All items → 1 Order
```

**Now:**

```
Cart → Items grouped by delivery date → Separate order per date
```

### Key Changes

| Area             | Before                   | After                                           |
| ---------------- | ------------------------ | ----------------------------------------------- |
| **Homepage**     | "Menu Hari Ini" (static) | Shows actual date, changes per selection        |
| **Menu fetch**   | `useMenu()` - all items  | `useMenuByDate(date)` - items for specific date |
| **Cart line**    | `{id, qty}`              | `{id, date, qty}` - ties item to delivery date  |
| **Cart display** | Flat list                | Grouped by delivery date with subtotals         |
| **Checkout**     | 1 order created          | N orders created (1 per unique delivery date)   |
| **Orders table** | No delivery date         | Each order has `delivery_date` field            |
| **Webhook**      | Single order object      | Array of orders grouped by delivery_date        |

---

## 📁 Files Changed

### Core Implementation

- `src/routes/index.tsx` - Homepage with date-aware menu selection
- `src/routes/cart.tsx` - Multi-date cart with grouped display
- `src/routes/orders.tsx` - Display delivery dates on orders
- `src/hooks/use-menu.ts` - New `useMenuByDate(date)` hook
- `src/hooks/use-cart.ts` - Complete rewrite for date-based lines
- `src/types/database.ts` - Added `DbMenuSchedule` type
- `src/lib/n8n.ts` - Updated webhook payload structure

### Documentation

- `docs/SETUP_GUIDE.md` - Complete setup instructions
- `docs/COPY_PASTE.txt` - Ready-to-paste SQL
- `docs/IMPLEMENTATION_SUMMARY.md` - Technical deep dive
- `docs/QUICK_START.md` - Feature overview

### Database

- `menu_schedules` table created (junction table)
- `orders.delivery_date` column added

---

## 🧪 Testing

### Manual Test Flow

1. **Homepage**
   - Select 2026-04-24 → See 6 menu items
   - Select 2026-04-25 → See 3 menu items (different set)
   - Date label shows actual date

2. **Add to Cart**
   - Add item from 2026-04-24
   - Add same/different item from 2026-04-25
   - Toast shows delivery date

3. **View Cart**
   - Items grouped in 2 sections (one per date)
   - Each section shows subtotal
   - Total = sum of subtotals

4. **Checkout**
   - Creates 2 order rows (1 per delivery_date)
   - Each order in database has correct delivery_date
   - Webhook sent with orders grouped by date

5. **Orders Page**
   - Both orders displayed
   - Each shows "Pengiriman [Date]" with calendar icon
   - Dates formatted as "Rabu, 24 April"

---

## 💾 Database Schema

### New Table: menu_schedules

```sql
CREATE TABLE public.menu_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id),
  available_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(menu_item_id, available_date)
);
```

### Updated Table: orders

```sql
ALTER TABLE public.orders ADD COLUMN delivery_date date;
```

---

## 🔧 How It Works

### Flow Diagram

```
User clicks date button
    ↓
selectedDate = '2026-04-24'
    ↓
useMenuByDate(selectedDate)
    ↓
Query: SELECT menu_items FROM menu_schedules
       WHERE available_date = '2026-04-24'
    ↓
Display items for that date
    ↓
User adds items from multiple dates
    ↓
Cart: [{id: 'menu-1', date: '2026-04-24', qty: 1},
       {id: 'menu-3', date: '2026-04-25', qty: 2}]
    ↓
Cart groups by date and displays 2 sections
    ↓
User clicks Checkout
    ↓
Create order for 2026-04-24: total = Rp 28,000
Create order for 2026-04-25: total = Rp 70,000
    ↓
Send webhook with both orders
    ↓
n8n processes and sends WhatsApp
```

### Cart Storage (localStorage)

```json
[
  {
    "id": "menu-item-uuid-1",
    "date": "2026-04-24",
    "qty": 1
  },
  {
    "id": "menu-item-uuid-3",
    "date": "2026-04-25",
    "qty": 2
  }
]
```

### Webhook Payload (New Format)

```json
{
  "customerName": "John Doe",
  "customerPhone": "6285648444086",
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [{ "name": "Nasi Rendang", "quantity": 1, "price": 28000 }],
      "subtotal": 28000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [{ "name": "Ayam Bakar", "quantity": 2, "price": 35000 }],
      "subtotal": 70000
    }
  ],
  "totalAmount": 98000,
  "orderDate": "2026-04-24T10:30:00Z"
}
```

---

## ⚠️ Important Notes

### For n8n

The webhook payload structure **changed**:

- Old: Single `orderId` + `items` array
- New: Multiple `orders` array, each with `deliveryDate`

**Action needed:** Update n8n workflow to handle new format

### For Admin Panel (Future)

Will need to build UI to manage `menu_schedules`:

- Add/remove menus per day
- Bulk operations (copy day, etc.)
- Calendar view

---

## 📝 Documentation Files

| File                        | Purpose                                       |
| --------------------------- | --------------------------------------------- |
| `SETUP_GUIDE.md`            | Complete setup with step-by-step instructions |
| `COPY_PASTE.txt`            | Just the SQL to copy-paste (no explanation)   |
| `IMPLEMENTATION_SUMMARY.md` | Technical architecture & testing checklist    |
| `QUICK_START.md`            | Feature overview & examples                   |
| `MANUAL_SEED_DATA.md`       | How to add more test data                     |

---

## ✅ Verification Checklist

Before going to production:

- [ ] Sample data inserted in menu_schedules
- [ ] Homepage shows different menus per date
- [ ] Cart groups items by delivery date
- [ ] Checkout creates separate orders per date
- [ ] Orders page displays delivery dates
- [ ] n8n workflow updated for new webhook format
- [ ] WhatsApp notifications send correctly
- [ ] No TypeScript errors in build
- [ ] Production deployed

---

## 📞 Support

Need help?

1. Check `SETUP_GUIDE.md` for step-by-step instructions
2. Review `IMPLEMENTATION_SUMMARY.md` for technical details
3. Run the SQL from `COPY_PASTE.txt` to add data

---

## 🎯 Next Steps

1. **Now:** Add sample data using `docs/COPY_PASTE.txt`
2. **Then:** Test the feature locally
3. **After:** Update n8n workflow for new webhook payload
4. **Later:** Build admin panel for menu schedule management

**Status:** ✅ Code ready → ⏳ Data seeding → 🚀 Testing → 📤 Deployment
