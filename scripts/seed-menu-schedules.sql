-- Seed menu_schedules for testing
-- This adds some menus for the next 7 days
-- Run this in Supabase SQL editor

-- Note: Replace the menu_item_id UUIDs with actual IDs from your menu_items table
-- You can get them by running: SELECT id, name FROM public.menu_items LIMIT 10;

-- Example: Add a few menus for each day (next 7 days from today)
-- Adjust dates as needed

-- Get today's date and add schedules
INSERT INTO public.menu_schedules (menu_item_id, available_date)
SELECT m.id, CURRENT_DATE + (1 - EXTRACT(DOW FROM CURRENT_DATE)::integer)::interval + (i::integer || ' days')::interval
FROM (SELECT DISTINCT ON (id) id FROM public.menu_items LIMIT 3) m,
     generate_series(0, 6) i
ON CONFLICT(menu_item_id, available_date) DO NOTHING;

-- This adds the first 3 menu items to each day for the next 7 days
-- Adjust the LIMIT or add more specific menu selections as needed
