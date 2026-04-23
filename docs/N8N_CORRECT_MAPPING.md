# n8n Correct Mapping for New Webhook Format

## Problem

The n8n workflow parameters are showing `undefined` because they're using incorrect expressions for the new webhook payload structure.

## New Webhook Payload Structure

```json
{
  "customerName": "Angga Riansah",
  "customerPhone": "62856484444086",
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [
        {
          "name": "Jus Jeruk",
          "quantity": 1,
          "price": 8000,
          "subtotal": 8000
        }
      ],
      "subtotal": 8000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [...],
      "subtotal": 15000
    }
  ],
  "totalAmount": 23000,
  "orderDate": "2026-04-23T14:04:39.347Z",
  "webhookUrl": "...",
  "executionMode": "production"
}
```

## Correct n8n Parameters

### For WhatsApp Message Node

**customerName**

```
{{ $json.customerName }}
```

✅ Result: "Angga Riansah"

**customerPhone**

```
{{ $json.customerPhone }}
```

✅ Result: "62856484444086"

**orderId** (use first order's delivery date as order identifier)

```
{{ $json.orders[0].deliveryDate }}
```

✅ Result: "2026-04-24"

**items** (this should be an array of all items from all orders)

```
{{ $json.orders.map(order => order.items).flat() }}
```

✅ Result: Array of all items across all delivery dates

**totalAmount**

```
{{ $json.totalAmount }}
```

✅ Result: 23000

**orderDate**

```
{{ $json.orderDate }}
```

✅ Result: "2026-04-23T14:04:39.347Z"

---

## Option A: Simple Message (Single WhatsApp for All Orders)

If you want to send ONE WhatsApp message with all orders combined:

**Message Body:**

```
Halo {{ $json.customerName }}! 👋

Pesanan Anda diterima:

{{ $json.orders.map(order => {
  const itemList = order.items.map(item => `• ${item.name} x${item.quantity} = Rp${item.subtotal.toLocaleString('id-ID')}`).join('\n');
  return `📅 Pengiriman ${order.deliveryDate}:\n${itemList}\nSubtotal: Rp${order.subtotal.toLocaleString('id-ID')}`;
}).join('\n\n') }}

━━━━━━━━━━━━━━━━━━━━━━━
💰 Total: Rp{{ $json.totalAmount.toLocaleString('id-ID') }}

Nomor Pesanan: {{ $json.orders[0].deliveryDate }}
Terima kasih! 🙏
```

---

## Option B: Multiple Messages (One WhatsApp per Order)

If you want to send SEPARATE WhatsApp messages for each delivery date:

Use a **Loop** node to iterate through `$json.orders`:

**Loop over:** `$json.orders`

**In the loop, send message:**

```
Halo {{ $json.customerName }}! 👋

Pesanan untuk pengiriman {{ $item.deliveryDate }}:

{{ $item.items.map(item => `• ${item.name} x${item.quantity} = Rp${item.price * item.quantity}`).join('\n') }}

Subtotal: Rp{{ $item.subtotal }}

Nomor Telepon: {{ $json.customerPhone }}
```

---

## Step-by-Step Fix in n8n

### 1. Find the "Normalize Phone" Node

**Look for:** A node that has Parameters tab with `phoneFormatted`

**Fix the expressions:**

| Parameter        | Current (WRONG)                                | Correct                     |
| ---------------- | ---------------------------------------------- | --------------------------- |
| `phoneFormatted` | `{{ $json.customerPhone.replace(/\D/g, "") }}` | `{{ $json.customerPhone }}` |
| `customerPhone`  | `{{ $json.customerPhone }}`                    | `{{ $json.customerPhone }}` |

(The phone is already formatted in the webhook, no need to reformat)

### 2. Find the WhatsApp Node

**Look for:** A node that sends WhatsApp messages

**Fix the expressions:**

| Parameter       | Current (WRONG)               | Correct                     |
| --------------- | ----------------------------- | --------------------------- |
| `customerName`  | (check what it is)            | `{{ $json.customerName }}`  |
| `customerPhone` | (check what it is)            | `{{ $json.customerPhone }}` |
| `message`       | (probably has hardcoded text) | See Option A or B above     |

### 3. Remove Any References to Single Order

**Delete/change:**

- `orderId` - OLD structure (single order)
- Direct `$json.items` - should be `$json.orders[].items`

### 4. Loop Through Orders if Needed

**If sending per-order messages:**

1. Add a **Loop** node
2. Set it to loop over: `$json.orders`
3. Inside loop, reference: `$item.deliveryDate`, `$item.items`, etc.

---

## Testing the Mapping

In n8n, to test if expressions work:

1. **Click on any Parameter field**
2. **Switch to Expression mode** (click the `=` or `{{ }}` button)
3. **Paste the expression** (e.g., `{{ $json.customerName }}`)
4. **It should show the value** in the preview

✅ If you see the actual value → Mapping is correct
❌ If you see `undefined` → Expression is wrong

---

## Quick Reference

**Structure access patterns:**

```
Single value: {{ $json.customerName }}
Array item: {{ $json.orders[0].deliveryDate }}
Map array: {{ $json.orders.map(o => o.deliveryDate).join(', ') }}
Flatten: {{ $json.orders.map(o => o.items).flat() }}
Loop: use Loop node with {{ $item.fieldName }}
```

---

## Example Complete WhatsApp Message (Option A)

Copy this exact message and adjust:

```
Halo {{ $json.customerName }}! 👋

Pesanan Anda telah diterima ✅

{{ $json.orders.map(order => {
  const items = order.items.map(item => `• ${item.name} x${item.quantity}`).join('\n');
  return `📅 ${order.deliveryDate}:\n${items}\nRp${order.subtotal}`;
}).join('\n\n') }}

━━━━━━━━━━━━━━━━━━━━━
💰 Total: Rp{{ $json.totalAmount }}
Terima kasih! 🙏
```

This will produce a message like:

```
Halo Angga Riansah! 👋

Pesanan Anda telah diterima ✅

📅 2026-04-24:
• Jus Jeruk x1
Rp8000

📅 2026-04-25:
• Ayam Bakar x2
Rp16000

━━━━━━━━━━━━━━━━━━━━━
💰 Total: Rp24000
Terima kasih! 🙏
```

---

## Common Mistakes to Avoid

❌ **Wrong:** `{{ $json.orderId }}` (doesn't exist)
✅ **Right:** `{{ $json.orders[0].deliveryDate }}`

❌ **Wrong:** `{{ $json.items }}` (at root level)
✅ **Right:** `{{ $json.orders.map(o => o.items).flat() }}`

❌ **Wrong:** `{{ $json.customerPhone.replace() }}` (phone already formatted)
✅ **Right:** `{{ $json.customerPhone }}`

❌ **Wrong:** Hardcoded message in the node
✅ **Right:** Dynamic message using `{{ $json.fieldName }}`

---

## Next Steps

1. **Update all parameters** in your WhatsApp node
2. **Test with the payload** shown in your screenshot
3. **Verify no `undefined` values** appear
4. **Check WhatsApp message** is sent correctly
5. **Publish the workflow**

Questions? Look at the screenshot you provided - the INPUT section on the left shows the actual data structure. Use that to write correct expressions!
