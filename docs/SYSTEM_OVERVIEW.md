# Sekotak Bekal System Overview

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SEKOTAK BEKAL APP                           │
│                   (React + TanStack Router)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   HOME (/)   │  │  CART (/cart)│  │ORDERS (/ord.)│           │
│  │              │  │              │  │              │           │
│  │ • Date picker│  │ • Group by   │  │ • Show order │           │
│  │ • Menu list  │  │   delivery   │  │   history    │           │
│  │ • Add to cart│  │   date       │  │ • Show       │           │
│  │              │  │ • Checkout   │  │   delivery   │           │
│  └──────────────┘  └──────────────┘  │   dates      │           │
│         │                 │            │              │           │
│         └─────────────────┴────────────┴──────────────┘           │
│                          │                                        │
│         ┌────────────────▼────────────────┐                      │
│         │   AuthContext (Custom Auth)     │                      │
│         │   • register(name, phone, pwd)  │                      │
│         │   • login(phone, pwd)           │                      │
│         │   • logout()                    │                      │
│         │   • Current user in memory      │                      │
│         └────────────────┬────────────────┘                      │
│                          │                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
                ┌──────────▼──────────┐
                │    SUPABASE         │
                │  (PostgreSQL DB)    │
                └──────────┬──────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌──────────┐      ┌──────────────┐
    │customers│       │  orders  │      │order_items   │
    ├────────┤       ├──────────┤      ├──────────────┤
    │id (UUID)│      │id (UUID) │      │id (UUID)     │
    │phone    │      │customer_id│     │order_id (FK) │
    │pwd_hash │      │total_amt  │     │menu_item_id  │
    │name     │      │delivery   │     │quantity      │
    │created_at│     │date (📅)  │     │price         │
    └────────┘       │status     │     └──────────────┘
                     │created_at │
                     └──────────┘
                           ▲
                           │ (join to)
                           │
                ┌──────────────────────┐
                │  menu_schedules      │
                ├──────────────────────┤
                │id (UUID)             │
                │menu_item_id (FK)     │
                │available_date (📅)   │
                │created_at            │
                └──────────────────────┘
                           ▲
                           │ (join to)
                           │
                    ┌──────────────┐
                    │ menu_items   │
                    ├──────────────┤
                    │id (UUID)     │
                    │name          │
                    │description   │
                    │price         │
                    │category      │
                    │image_url     │
                    └──────────────┘
```

---

## Data Flow: Registration

```
USER INPUT (Auth Page)
    │
    ├─ name: "Sari Wulandari"
    ├─ phone: "0812345678"
    └─ password: "test1234"
         │
         ▼
    AuthContext.register()
         │
         ├─ Normalize phone: "0812345678" → "628123456789"
         ├─ Hash password: SHA-256(test1234) → hash_xyz...
         ├─ Generate UUID: crypto.randomUUID() → uuid_abc...
         │
         └─────────────────────────────┐
                                       │
         ┌─────────────────────────────▼──────────────────┐
         │  INSERT INTO customers (                        │
         │    id, name, phone, password_hash, created_at   │
         │  ) VALUES (                                     │
         │    'uuid_abc...', 'Sari...', '628123456789...'  │
         │    'hash_xyz...', NOW()                         │
         │  )                                              │
         └─────────────────────────────┬──────────────────┘
                                       │
         ┌─────────────────────────────▼──────────────────┐
         │ localStorage["sekotak_user_id"] = "uuid_abc..." │
         └─────────────────────────────┬──────────────────┘
                                       │
                                       ▼
                         ✅ Redirect to home (/)
```

---

## Data Flow: Add to Cart + Checkout

```
HOME PAGE: User selects 2026-04-24, adds "Ayam Bakar" ×1
         │
         ▼
    useCart.add(menu_item_id, "2026-04-24", 1)
         │
         ├─ Create CartLine: {
         │    id: "menu_item_id_xyz",
         │    date: "2026-04-24",
         │    qty: 1
         │  }
         │
         ├─ Save to localStorage["sekotak_cart"] = [CartLine, ...]
         │
         └─ Toast: "Ayam Bakar ditambahkan untuk Rabu, 24 April"

USER SELECTS 2026-04-25, adds "Ikan Jimbaran" ×1
         │
         ▼
    useCart.add(menu_item_id, "2026-04-25", 1)
         │
         ├─ Append CartLine: {
         │    id: "menu_item_id_456",
         │    date: "2026-04-25",
         │    qty: 1
         │  }
         │
         └─ localStorage updated

CART PAGE: User reviews items grouped by delivery date
         │
         ├─ Group 1 (2026-04-24): Ayam Bakar ×1 = Rp 28.000
         ├─ Group 2 (2026-04-25): Ikan Jimbaran ×1 = Rp 35.000
         └─ Total: Rp 63.000

USER CLICKS "KONFIRMASI PESANAN"
         │
         ▼
    handleCheckout()
         │
         ├─ Verify: user logged in? ✅
         ├─ Verify: cart not empty? ✅
         │
         ├─ Group items by delivery_date:
         │  ┌─ "2026-04-24": [CartLine(Ayam Bakar)]
         │  └─ "2026-04-25": [CartLine(Ikan Jimbaran)]
         │
         ├─ For each date group:
         │  └─ INSERT ORDER:
         │     {
         │       customer_id: "user_uuid",
         │       delivery_date: "2026-04-24",
         │       total_amount: 28000,
         │       status: "menunggu_pembayaran"
         │     }
         │     → Returns order.id = "order_uuid_1"
         │
         │  └─ INSERT ORDER ITEMS:
         │     {
         │       order_id: "order_uuid_1",
         │       menu_item_id: "menu_xyz",
         │       quantity: 1,
         │       price: 28000
         │     }
         │
         ├─ Prepare n8n webhook payload:
         │  {
         │    "customerName": "Sari Wulandari",
         │    "customerPhone": "628123456789",
         │    "orders": [
         │      {
         │        "deliveryDate": "2026-04-24",
         │        "items": [
         │          { "name": "Ayam Bakar", "quantity": 1, "price": 28000 }
         │        ],
         │        "subtotal": 28000
         │      },
         │      {
         │        "deliveryDate": "2026-04-25",
         │        "items": [
         │          { "name": "Ikan Jimbaran", "quantity": 1, "price": 35000 }
         │        ],
         │        "subtotal": 35000
         │      }
         │    ],
         │    "totalAmount": 63000,
         │    "orderDate": "2026-04-23T12:34:56Z"
         │  }
         │
         ├─ POST to n8n webhook URL
         │
         └─ Clear localStorage cart
            Redirect to /orders ✅
```

---

## Data Flow: n8n Webhook to WhatsApp

```
n8n Receives Webhook
    │
    ├─ Extract customer name: "Sari Wulandari"
    ├─ Extract phone: "628123456789" (without +62 prefix)
    │
    └─ Loop through orders[] array:
         │
         ├─ Order 1 (2026-04-24):
         │  ├─ Delivery date: "Rabu, 24 April"
         │  ├─ Items: "1× Ayam Bakar"
         │  └─ Subtotal: "Rp 28.000"
         │
         └─ Order 2 (2026-04-25):
            ├─ Delivery date: "Kamis, 25 April"
            ├─ Items: "1× Ikan Jimbaran"
            └─ Subtotal: "Rp 35.000"
              
    Build WhatsApp message:
    ┌──────────────────────────────────────┐
    │ Halo Sari Wulandari! 🎉              │
    │                                      │
    │ Pesanan kamu sudah dikonfirmasi:     │
    │                                      │
    │ 📅 Rabu, 24 April                   │
    │ 🍲 1× Ayam Bakar                    │
    │ Rp 28.000                           │
    │                                      │
    │ 📅 Kamis, 25 April                  │
    │ 🍲 1× Ikan Jimbaran                 │
    │ Rp 35.000                           │
    │                                      │
    │ Total: Rp 63.000                    │
    │ Terima kasih! 🙏                    │
    └──────────────────────────────────────┘
         │
         ▼
    Send via WhatsApp API
         │
         ▼
    Customer receives message ✅
```

---

## Authentication Security

```
REGISTER:
  password "test1234"
         │
         ▼
  crypto.subtle.digest('SHA-256', encoder.encode("test1234"))
         │
         ▼
  returns: Uint8Array → convert to hex string
         │
         ▼
  Store in customers.password_hash
         ✅ Original password never stored

LOGIN:
  User enters phone: "0812345678"
  User enters password: "test1234"
         │
         ├─ Normalize phone: "628123456789"
         │
         ├─ Query: SELECT password_hash FROM customers WHERE phone = "628123456789"
         │
         ├─ Hash input: SHA-256("test1234") → hash_user
         │
         ├─ Compare: hash_user === stored_password_hash?
         │  ✅ Match → session valid, store UUID in localStorage
         │  ❌ No match → "Login gagal"
         │
         └─ Session stored as: localStorage["sekotak_user_id"] = customer.id
            (removed on logout)
```

---

## Key Design Decisions

| Decision | Reason | Trade-offs |
|----------|--------|-----------|
| **Custom Auth (phone+pwd)** | User explicit: no email rate limits, MVP simple | Must handle auth edge cases ourselves |
| **SHA-256 over bcrypt** | crypto.subtle available in browsers | Slightly weaker than bcrypt, but sufficient for MVP |
| **RLS Disabled** | Custom auth = app-layer access control | Must ensure app enforces customer.id checks |
| **menu_schedules table** | Flexible: 1 menu multiple dates, 1 date multiple menus | Extra join needed in queries |
| **Multi-order checkout** | Real-world: different items → different delivery dates | More complex logic (but necessary) |
| **orders[] array in webhook** | Scale: single webhook for all orders in one transaction | Must update n8n to handle array |

---

## Testing Checklist

- [ ] Register with phone, login, logout
- [ ] Select menu from different dates
- [ ] Add items from Day 1 and Day 2 to cart
- [ ] Cart shows 2 sections grouped by delivery date
- [ ] Subtotals and total correct
- [ ] Checkout creates 2 orders in Supabase (1 per date)
- [ ] Each order has correct delivery_date
- [ ] Orders page displays both orders with dates
- [ ] n8n receives orders[] array in webhook
- [ ] WhatsApp message shows both orders

---

## Quick SQL Queries for Debugging

```sql
-- See all customers:
SELECT id, name, phone, created_at FROM customers;

-- See all orders:
SELECT id, customer_id, delivery_date, total_amount, status FROM orders;

-- See all order items:
SELECT oi.id, oi.order_id, m.name, oi.quantity, oi.price
FROM order_items oi
JOIN menu_items m ON oi.menu_item_id = m.id;

-- See menu available for specific date:
SELECT m.* FROM menu_items m
JOIN menu_schedules ms ON m.id = ms.menu_item_id
WHERE ms.available_date = '2026-04-24'
ORDER BY m.name;

-- Check RLS status:
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
-- Should show all false for MVP
```

