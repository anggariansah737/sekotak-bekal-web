# Seeding Menu Schedules

To test the menu-per-day feature, you need to populate the `menu_schedules` table with test data.

## Method 1: Using Supabase Dashboard (Recommended for Quick Testing)

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Run this query:

```sql
-- First, get menu item IDs
SELECT id, name FROM public.menu_items LIMIT 10;
```

4. Then, insert schedules for the next 7 days. Replace the menu_item_id UUIDs with actual IDs from the previous query:

```sql
INSERT INTO public.menu_schedules (menu_item_id, available_date)
VALUES
  -- Day 1 (2026-04-23)
  ('uuid-of-menu-1', '2026-04-23'),
  ('uuid-of-menu-2', '2026-04-23'),
  ('uuid-of-menu-3', '2026-04-23'),

  -- Day 2 (2026-04-24)
  ('uuid-of-menu-1', '2026-04-24'),
  ('uuid-of-menu-4', '2026-04-24'),

  -- Day 3 (2026-04-25)
  ('uuid-of-menu-2', '2026-04-25'),
  ('uuid-of-menu-5', '2026-04-25'),

  -- Add more days as needed...
ON CONFLICT(menu_item_id, available_date) DO NOTHING;
```

## Method 2: Using Node.js Script

Update the RLS policy first to allow inserts:

```sql
-- In Supabase SQL Editor, update the RLS policy:
DROP POLICY IF EXISTS "public read schedules" ON public.menu_schedules;

CREATE POLICY "public read schedules" ON public.menu_schedules
  FOR SELECT TO public USING (true);

CREATE POLICY "public insert schedules" ON public.menu_schedules
  FOR INSERT TO public WITH CHECK (true);
```

Then run:

```bash
VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... node scripts/seed-schedules.js
```

## After Seeding

You should see different menus when you select different dates in the app. The cart will show items grouped by delivery date.

## Testing the Feature

1. Open the app at `/`
2. Click on different dates at the top
3. You should see different menu items for different dates
4. Add items from different dates to cart
5. Go to `/cart` - items should be grouped by delivery date
6. Checkout creates separate orders for each delivery date
