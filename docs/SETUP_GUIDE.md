# 🚀 Setup Guide - Menu Per-Day Feature

## Overview

You've got a fully-working menu-per-day ordering system. Just need to add 1 minute of test data.

## What You Have

✅ All code implemented and building successfully  
✅ Database schema ready (menu_schedules table created)  
✅ Cart, Homepage, Orders pages all updated  
✅ Just need: Sample data in menu_schedules

## Quick Setup (1 Minute)

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com
2. Select your project
3. Click **SQL Editor** in left sidebar

### Step 2: Copy & Paste the Data

**Select all this code:**

```sql
INSERT INTO public.menu_schedules (menu_item_id, available_date) VALUES
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-24'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-24'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-24'),
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-24'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-24'),
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-24'),
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-25'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-25'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-25'),
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-26'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-26'),
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-26'),
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-27'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-27'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-28'),
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-28'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-28'),
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-29'),
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-29'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-30'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-30')
ON CONFLICT(menu_item_id, available_date) DO NOTHING;
```

**Paste into SQL Editor** → Click **Run**

### Step 3: Verify Success

**Run this to check:**

```sql
SELECT available_date, COUNT(*) as count
FROM public.menu_schedules
WHERE available_date >= '2026-04-24'
GROUP BY available_date
ORDER BY available_date;
```

You should see:

```
available_date │ count
2026-04-24     │ 6
2026-04-25     │ 3
2026-04-26     │ 3
2026-04-27     │ 2
2026-04-28     │ 3
2026-04-29     │ 2
2026-04-30     │ 2
```

### Step 4: Test the Feature

1. Start the app: `npm run dev`
2. Open http://localhost:5173
3. Select different dates → Different menus appear ✨
4. Add from multiple dates → Cart groups by date
5. Checkout → Creates multi-date orders

## What's Happening

### Data Structure

6 menu items total:

1. **Nasi Rendang Ayam** (2026-04-24 to 27, 29)
2. **Gado-gado Spesial** (2026-04-24, 25, 27, 30)
3. **Soto Ayam Kuning** (2026-04-24, 25, 28, 30)
4. **Perkedel Goreng** (2026-04-24, 26, 28)
5. **Ayam Goreng Crispy** (2026-04-24, 26, 28)
6. **Lumpia Sayur** (2026-04-24, 26, 27, 29)

Each date has different menu combinations so you can test:

- ✅ Selecting different dates shows different items
- ✅ Same item available on multiple days
- ✅ Different items per day

### What Happens When You...

**Click date buttons (2026-04-24)**

```
useMenuByDate('2026-04-24')
  ↓
Fetch from menu_schedules WHERE available_date = '2026-04-24'
  ↓
Show 6 menu items
```

**Click a different date (2026-04-25)**

```
useMenuByDate('2026-04-25')
  ↓
Fetch from menu_schedules WHERE available_date = '2026-04-25'
  ↓
Show 3 menu items (different set)
```

**Add to cart from 2 dates**

```
add('menu-id-1', '2026-04-24', 1)
add('menu-id-3', '2026-04-25', 1)
  ↓
localStorage: [
  {id: 'menu-id-1', date: '2026-04-24', qty: 1},
  {id: 'menu-id-3', date: '2026-04-25', qty: 1}
]
  ↓
Cart groups by date and displays 2 sections
```

**Checkout**

```
For each unique date:
  - Create 1 order row with that delivery_date
  - Insert all order_items for that date
  - Send to n8n webhook in single request
```

## Testing Checklist

- [ ] SQL inserted without errors
- [ ] SELECT verify shows correct counts
- [ ] App shows 6 items on 2026-04-24
- [ ] App shows 3 items on 2026-04-25
- [ ] Different dates show different items
- [ ] Can add same item from different dates
- [ ] Cart groups items by delivery date
- [ ] Subtotals shown per date
- [ ] Checkout works
- [ ] Orders page shows delivery dates

## Troubleshooting

**Q: Items not showing for a date?**
A: Make sure the date format is exactly '2026-04-24' (ISO format)

**Q: Same items on all dates?**
A: Check the menu_item_id values are correct (UUIDs above)

**Q: RLS error when inserting?**
A: Make sure you're logged in to Supabase with a valid account

**Q: Cart not grouping by date?**
A: Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R) to clear cache

## Files to Reference

- [PASTE_TO_SUPABASE.sql](./PASTE_TO_SUPABASE.sql) - Ready-to-copy SQL
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [QUICK_START.md](./QUICK_START.md) - Feature overview

## Next Steps After Testing

1. ✅ Confirm menu-per-day works
2. Update n8n workflow to handle new webhook payload
3. Create admin panel to manage menu schedules (future)

---

**That's it!** 🎉 The feature is ready. Just add the data above.
