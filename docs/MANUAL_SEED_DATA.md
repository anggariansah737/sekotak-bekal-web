# Seed Sample Data for 2026-04-24

## Status

RLS policy currently blocks anon key from inserting. Need to run SQL directly in Supabase.

## Steps to Add Sample Data

### 1. Go to Supabase Dashboard

- Login to https://supabase.com
- Open project
- Go to **SQL Editor**

### 2. Run This SQL (Copy & Paste)

```sql
-- Insert menu schedules for 2026-04-24 to 2026-04-30
-- Using the 6 available menu items

INSERT INTO public.menu_schedules (menu_item_id, available_date) VALUES
-- 2026-04-24 (all 6 items)
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-24'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-24'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-24'),
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-24'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-24'),
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-24'),

-- 2026-04-25 (3 items)
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-25'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-25'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-25'),

-- 2026-04-26 (3 items)
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-26'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-26'),
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-26'),

-- 2026-04-27 (2 items)
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-27'),
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-27'),

-- 2026-04-28 (3 items)
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-28'),
('80551deb-4113-4b62-ab2e-d9d8ca49eafb', '2026-04-28'),
('63ca9543-5b4f-4948-b6e1-71d82b2fe24b', '2026-04-28'),

-- 2026-04-29 (2 items)
('03ac910c-9ddf-42de-9826-ae7f3ddfb809', '2026-04-29'),
('94a0495c-f16c-49e0-90da-7abd997638e2', '2026-04-29'),

-- 2026-04-30 (2 items)
('c76a7a87-2eb3-4f4b-b102-6785ea3eb36b', '2026-04-30'),
('e90d1ca3-27a8-49c3-99c9-ac571bc3eb54', '2026-04-30')

ON CONFLICT(menu_item_id, available_date) DO NOTHING;
```

### 3. Verify the Data

Run this to check:

```sql
SELECT available_date, COUNT(*) as menu_count
FROM public.menu_schedules
WHERE available_date >= '2026-04-24'
GROUP BY available_date
ORDER BY available_date;
```

Expected output:

```
available_date | menu_count
2026-04-24     | 6
2026-04-25     | 3
2026-04-26     | 3
2026-04-27     | 2
2026-04-28     | 3
2026-04-29     | 2
2026-04-30     | 2
```

## Next Steps

1. Copy the INSERT SQL above
2. Open Supabase SQL Editor
3. Paste and run the query
4. Verify with the SELECT query
5. Refresh the app - you'll see different menus for each date!

## Menu Item Names

```
94a0495c-f16c-49e0-90da-7abd997638e2 → Nasi Rendang Ayam
c76a7a87-2eb3-4f4b-b102-6785ea3eb36b → Gado-gado Spesial
e90d1ca3-27a8-49c3-99c9-ac571bc3eb54 → Soto Ayam Kuning
80551deb-4113-4b62-ab2e-d9d8ca49eafb → Perkedel Goreng
63ca9543-5b4f-4948-b6e1-71d82b2fe24b → Ayam Goreng Crispy
03ac910c-9ddf-42de-9826-ae7f3ddfb809 → Lumpia Sayur
```

## After Seeding

The app will now:

- ✅ Show 6 menus when you select 2026-04-24
- ✅ Show 3 menus when you select 2026-04-25
- ✅ Show different menus for different dates
- ✅ Let you add items from multiple dates
- ✅ Group items by date in cart
- ✅ Create separate orders per date on checkout
