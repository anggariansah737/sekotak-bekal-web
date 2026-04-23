# Menu Per-Day Implementation Summary

## Overview

Successfully implemented a date-based menu system where customers can order items from different delivery dates in a single cart checkout. The system creates separate orders per delivery date while maintaining transaction consistency.

## Architecture Decisions

### 1. Database Schema

- **Junction table** `menu_schedules(id, menu_item_id, available_date, created_at)` with UNIQUE constraint on `(menu_item_id, available_date)`
  - Allows flexibility: 1 menu can appear on multiple days, 1 day can have multiple menus
  - Alternative rejected: Adding `available_date` column to `menu_items` (less flexible)
- **orders table** - Added `delivery_date` column (date type, nullable for past orders)
  - One order per delivery date per checkout
  - Different delivery dates = different orders in database

### 2. Cart Structure

- **CartLine** now includes: `{ id: string, date: string (ISO), qty: number }`
  - Stored in localStorage as JSON array
  - Allows customers to add same menu item for different dates
- **Key by (id, date)** - Both fields required to uniquely identify a cart line

### 3. Checkout Flow

```
Customer adds items from multiple dates
    ↓
Cart displays items grouped by delivery_date
    ↓
Checkout: Create 1 order per unique delivery_date
    ↓
For each order, insert associated order_items rows
    ↓
Single n8n webhook with all orders grouped by date
    ↓
n8n processes orders and sends WhatsApp notifications
```

## Implementation Phases (All Complete ✅)

### Phase 1: Database Setup ✅

- Created `menu_schedules` junction table with RLS (public read)
- Added `delivery_date` column to `orders` table
- Created unique constraint on `(menu_item_id, available_date)`

### Phase 2: TypeScript Types ✅

**File:** `src/types/database.ts`

- Added `DbMenuSchedule` interface
- Updated `DbOrder` with `delivery_date: string | null`

### Phase 3: Hooks ✅

**File:** `src/hooks/use-menu.ts`

- New `useMenuByDate(date: string)`: Fetches menu items for a specific date from `menu_schedules` join

**File:** `src/hooks/use-cart.ts` (complete rewrite)

- `CartLine` now includes `date` field
- `add(id, date, qty)` - Finds or creates line by (id, date)
- `setQty(id, date, qty)` - Updates quantity or removes if qty <= 0
- `remove(id, date)` - Removes by both id and date
- `groupByDate()` - Returns `Map<string, CartLine[]>`
- `useCartWithItems(menuItems)` - Enhanced with `itemsByDate()` returning `Map<string, hydrated items[]>`

### Phase 4: Homepage ✅

**File:** `src/routes/index.tsx`

- Calculates `selectedDate` as ISO string from selected day button
- Passes `selectedDate` to `useMenuByDate(selectedDate)` hook
- Shows actual selected date label (e.g., "Rabu, 24 April") instead of "Menu Hari Ini"
- Updated `add()` call: `add(m.id, selectedDate, 1)`
- Added empty state: "Menu belum tersedia untuk hari ini" when no items for selected date
- Availability badge only shows if items exist

### Phase 5: Cart Page ✅

**File:** `src/routes/cart.tsx`

- Complete UI redesign to group items by delivery date
- Each date group shows:
  - Calendar icon + formatted date label
  - Items for that date with smaller compact cards
  - Subtotal for that date
- Quantity controls updated to work with (id, date) tuples
- Delete button references both id and date

**Checkout Logic:**

```typescript
// For each unique delivery_date:
//  1. Create order row with delivery_date field
//  2. Insert order_items for all items with that delivery_date
//  3. Collect all orders for webhook payload
// Single webhook sent with all orders grouped by date
```

- Updated `triggerOrderWebhook()` payload structure

### Phase 6: Orders Page ✅

**File:** `src/routes/orders.tsx`

- Added Calendar icon to display delivery_date
- Format: "Pengiriman Rabu, 28 April"
- Distinguishes between `created_at` (order created date) and `delivery_date` (delivery date)

### Phase 7: Webhook Integration ✅

**File:** `src/lib/n8n.ts`

- Updated `OrderWebhookPayload` structure:

```typescript
{
  customerName: string
  customerPhone: string
  orders: [{
    deliveryDate: string
    items: [{name, quantity, price}]
    subtotal: number
  }]
  totalAmount: number
  orderDate: string
}
```

## Key Files Modified

```
src/
├── types/database.ts          → DbMenuSchedule, DbOrder.delivery_date
├── hooks/
│   ├── use-menu.ts           → useMenuByDate(date)
│   └── use-cart.ts           → CartLine.date, rewritten logic
├── routes/
│   ├── index.tsx             → selectedDate, useMenuByDate, empty state
│   ├── cart.tsx              → Complete rewrite: groupByDate UI, multi-order checkout
│   └── orders.tsx            → Display delivery_date
└── lib/
    └── n8n.ts                → Updated OrderWebhookPayload

scripts/
├── seed-schedules.js         → Node.js script to populate menu_schedules
└── seed-menu-schedules.sql   → SQL reference for Supabase dashboard

docs/
├── SEED_MENU_SCHEDULES.md    → Instructions for seeding test data
└── IMPLEMENTATION_SUMMARY.md → This file
```

## Testing Guide

### 1. Seed Test Data

Choose either method:

**Method A: Supabase Dashboard (Fastest)**

1. Go to SQL Editor in Supabase dashboard
2. Run: `SELECT id, name FROM public.menu_items LIMIT 10;`
3. Copy a few menu_item_id values
4. Insert schedules for next 7 days using those IDs
5. See [SEED_MENU_SCHEDULES.md](./SEED_MENU_SCHEDULES.md) for exact SQL

**Method B: Node.js Script**

- Note: Requires RLS policy adjustment first
- Run: `npm run seed-schedules` (after setting up script)

### 2. Manual Testing Checklist

Navigate to homepage (`/`):

- [ ] Select different dates using date buttons
- [ ] Verify menu changes for each date
- [ ] Each date shows different set of items (or empty if no schedule)
- [ ] Date label updates (e.g., "Rabu, 24 April")
- [ ] Availability badge hides when no items

Add items:

- [ ] Add item from Day 1
- [ ] Add same item from Day 2 (should create 2 separate cart lines)
- [ ] Toast shows date in message: "Nasi Rendang ditambahkan untuk Rabu, 24 April"

Cart (`/cart`):

- [ ] Items grouped by delivery date (separate sections)
- [ ] Each date section shows Calendar icon + date label
- [ ] Quantity controls work correctly
- [ ] Delete buttons remove only that line
- [ ] Subtotal shown per date
- [ ] Total shows sum of all dates

Checkout:

- [ ] Click "Konfirmasi Pesanan"
- [ ] Redirect to orders page
- [ ] Check Supabase `orders` table:
  - [ ] 2 order rows created (1 per date)
  - [ ] Each has correct `delivery_date`
  - [ ] `total_amount` correct per date
  - [ ] `status: "menunggu_pembayaran"`
- [ ] Check `order_items` table:
  - [ ] Correct items per order
  - [ ] Quantities correct
  - [ ] Prices correct

Orders page (`/orders`):

- [ ] Both orders listed
- [ ] Each shows correct status badge
- [ ] Delivery dates displayed with Calendar icon
- [ ] Format correct: "Pengiriman Rabu, 28 April"
- [ ] Item previews correct

n8n Webhook:

- [ ] Webhook receives POST request
- [ ] Payload contains `orders[]` array with 2 entries
- [ ] Each order has `deliveryDate`, `items`, `subtotal`
- [ ] `totalAmount` is sum of subtotals
- [ ] WhatsApp message sent with correct order info

## Limitations & Future Work

### Current Limitations

1. **No admin panel yet** - Manually add `menu_schedules` entries via Supabase dashboard
2. **RLS policy restricts inserts** - Anon key can't insert; need service role for seeding
3. **No migration history** - If admin removes schedule, old orders still have delivery_date

### Future Enhancements

1. **Admin panel** to manage menu schedules (add/remove/copy across days)
2. **Bulk operations** (copy menu from Day 1 to Days 2-5)
3. **Analytics** showing which menus are popular by day
4. **Recurring patterns** (same menu every Monday, etc.)
5. **Customer notifications** when delivery_date approaches

## Code Quality

✅ **Build**: Compiles with no TypeScript errors  
✅ **Types**: Full type safety with `DbMenuSchedule` and updated `DbOrder`  
✅ **State Management**: localStorage-based cart with event sync  
✅ **UI**: Responsive, accessible (ARIA labels), semantic HTML  
✅ **Error Handling**: Proper error states in checkout flow

## Deployment Notes

- Ensure Supabase schema migrations are applied (menu_schedules table + delivery_date column)
- Populate menu_schedules with at least some test data before going live
- Update n8n workflow to handle new webhook payload structure
- Test webhook delivery in staging before production
- Monitor WhatsApp notification delivery with new payload format
