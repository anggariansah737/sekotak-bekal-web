# n8n Workflow Update - Step by Step Guide

## 🎯 Goal

Update n8n workflow from handling **single orders** to handling **multiple orders per delivery date** in one webhook.

## 📊 Current vs New

**Current (Old):**

```
Webhook → Normalize Phone → Code → WAHA Send Text → WAHA Send Image
(Process 1 order)
```

**New:**

```
Webhook → Parse Payload → Loop Over Orders → Build Message → WAHA Send Text → WAHA Send Image
(Process N orders, 1 per delivery date)
```

---

## 📋 Complete Step-by-Step

### Step 1: Delete Old Nodes (Optional - or Keep and Update)

If you want clean slate:

1. Open n8n workflow: `hjKwIjmuzvwgK9Xq`
2. Delete all nodes except Webhook
3. Or just update existing nodes (see steps below)

### Step 2: Update Webhook Node (Keep Same)

**Settings:**

- Path: `sekotak-order` (keep same)
- Response Mode: `On Received`
- Response Data: `{"success": true}`

No changes needed.

### Step 3: Add "Parse Payload" Code Node

1. Add new **Code** node after Webhook
2. Name it: `Parse Payload`
3. In **JavaScript** section, paste this:

```javascript
// Parse webhook payload and normalize phone
const { customerName, customerPhone, orders, totalAmount, orderDate } =
  $input.all().body;

// Normalize phone number
let phone = customerPhone || "";
if (phone.startsWith("0")) {
  phone = "62" + phone.slice(1);
} else if (!phone.startsWith("62")) {
  phone = "62" + phone;
}

return {
  customerName: customerName || "Customer",
  phone,
  orders: orders || [],
  totalAmount: totalAmount || 0,
  orderDate: orderDate || new Date().toISOString(),
  orderCount: orders ? orders.length : 0,
};
```

4. Click **Execute** to test

### Step 4: Add "Loop Over Orders" Node

1. Add **Execute For Each** node (or Loop node)
2. Name it: `Loop Over Orders`
3. Set **Loop List**:
   ```
   {{ $node.parsePayload.json.orders }}
   ```
4. This will iterate through each order

### Step 5: Add "Build Message" Code Node (Inside Loop)

1. Add **Code** node inside the loop
2. Name it: `Build Message`
3. Paste this JavaScript:

```javascript
// Build WhatsApp message for this specific delivery date
const order = $input.all();
const { deliveryDate, items, subtotal } = order;
const { customerName, phone, totalAmount, orderCount } =
  $node.parsePayload.json;

// Format delivery date
const date = new Date(deliveryDate);
const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const dayName = dayNames[date.getDay()];
const monthName = monthNames[date.getMonth()];

// Build message
let message = "🍲 *Pesanan Dikonfirmasi*\n\n";
message += `Halo ${customerName},\n\n`;
message += `📅 *Pengiriman: ${dayName}, ${date.getDate()} ${monthName} 2026*\n\n`;
message += "*Menu Pesanan:*\n";

if (items && items.length > 0) {
  items.forEach((item) => {
    const itemPrice = item.price || 0;
    message += `• ${item.name} ×${item.quantity}\n`;
    message += `  Rp ${itemPrice.toLocaleString("id-ID")}\n`;
  });
}

message += `\n*Subtotal*: Rp ${subtotal.toLocaleString("id-ID")}\n`;

// Show total only on last order
const isLastOrder = $loop.index === orderCount - 1;
if (isLastOrder) {
  message += `\n💰 *Total Pembayaran*: Rp ${totalAmount.toLocaleString("id-ID")}\n`;
}

message += "\n✅ Tunjukkan QRIS di bawah untuk pembayaran.\n\n";
message += "Terima kasih! 🙏";

return {
  message,
  phone,
  deliveryDate,
  isLastOrder,
};
```

4. Test and verify output

### Step 6: Add WAHA Send Text Node

1. Add **WAHA Send Text** node
2. Configure:
   - **Phone**: `{{ $node.buildMessage.json.phone }}`
   - **Message**: `{{ $node.buildMessage.json.message }}`
3. Test with real phone number

### Step 7: Add WAHA Send Image Node

1. Add **WAHA Send Image** node
2. Configure:
   - **Phone**: `{{ $node.buildMessage.json.phone }}`
   - **Image URL**: `https://sekotak.app/qris.jpg` (or your QRIS URL)
   - **Caption**: `Scan untuk bayar`

### Step 8: Add Return Response Node

1. Add **Set** node at the end
2. Name it: `Return Response`
3. Set values:
   - `success` = `true`
   - `message` = `All orders processed`
   - `ordersCount` = `{{ $node.parsePayload.json.orderCount }}`

### Step 9: Connect All Nodes

Flow should be:

```
Webhook
   ↓
Parse Payload
   ↓
Loop Over Orders
   ↓
Build Message
   ↓
WAHA Send Text
   ↓
WAHA Send Image
   ↓
Return Response
```

---

## 🧪 Testing

### Test Case 1: Single Order

**Webhook Test Body:**

```json
{
  "customerName": "John Doe",
  "customerPhone": "6285648444086",
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [{ "name": "Nasi Rendang Ayam", "quantity": 1, "price": 28000 }],
      "subtotal": 28000
    }
  ],
  "totalAmount": 28000,
  "orderDate": "2026-04-24T10:30:00Z"
}
```

**Expected Result:**

- 1 WhatsApp text message sent
- Message shows: "Pengiriman Rabu, 24 April", "Nasi Rendang Ayam ×1", "Total: Rp 28.000"
- QRIS image sent

### Test Case 2: Multi-Date Order (The Real Test!)

**Webhook Test Body:**

```json
{
  "customerName": "Jane Smith",
  "customerPhone": "6285648444086",
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [
        { "name": "Nasi Rendang Ayam", "quantity": 1, "price": 28000 },
        { "name": "Gado-gado Spesial", "quantity": 1, "price": 22000 }
      ],
      "subtotal": 50000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [
        { "name": "Ayam Goreng Crispy", "quantity": 2, "price": 35000 }
      ],
      "subtotal": 70000
    }
  ],
  "totalAmount": 120000,
  "orderDate": "2026-04-24T10:30:00Z"
}
```

**Expected Result:**

- **2 WhatsApp messages** (one per delivery date):
  1. First message:

     ```
     🍲 Pesanan Dikonfirmasi

     Halo Jane Smith,

     📅 Pengiriman: Rabu, 24 April 2026

     Menu Pesanan:
     • Nasi Rendang Ayam ×1
       Rp 28.000
     • Gado-gado Spesial ×1
       Rp 22.000

     Subtotal: Rp 50.000

     ✅ Tunjukkan QRIS di bawah untuk pembayaran.

     Terima kasih! 🙏
     ```

  2. Second message:

     ```
     🍲 Pesanan Dikonfirmasi

     Halo Jane Smith,

     📅 Pengiriman: Kamis, 25 April 2026

     Menu Pesanan:
     • Ayam Goreng Crispy ×2
       Rp 35.000

     Subtotal: Rp 70.000

     💰 Total Pembayaran: Rp 120.000

     ✅ Tunjukkan QRIS di bawah untuk pembayaran.

     Terima kasih! 🙏
     ```

  3. QRIS images sent (2x or 1x depending on logic)

---

## 🔧 Troubleshooting

### Issue: Messages Not Sending

**Check:**

1. WAHA node has correct WhatsApp connection
2. Phone number is valid (format: 628...)
3. Image URL is accessible
4. Message content is not empty

### Issue: Wrong Date Format

**Fix:** Ensure delivery date is ISO format `YYYY-MM-DD` (e.g., `2026-04-24`)

### Issue: Loop Not Executing

**Check:**

- `loopList` is set to: `{{ $node.parsePayload.json.orders }}`
- `orders` array is not empty in webhook payload
- Test with sample multi-order payload

### Issue: Total Amount Shows Wrong

**Check:**

- Only show `totalAmount` on last order: `isLastOrder` condition
- `totalAmount` in webhook matches sum of subtotals

---

## 📝 Checklist

- [ ] Parse Payload code node added & tested
- [ ] Loop Over Orders node added
- [ ] Build Message code node added with formatting
- [ ] WAHA Send Text node configured
- [ ] WAHA Send Image node configured
- [ ] Return Response node added
- [ ] All nodes connected in correct order
- [ ] Tested with single order
- [ ] Tested with multi-date order
- [ ] WhatsApp messages receive correctly
- [ ] Date formatting is correct
- [ ] Total amount shows only on last order
- [ ] QRIS image sends successfully
- [ ] Workflow published/active

---

## 📞 Quick Reference

**Webhook URL:** Check your `.env` → `VITE_N8N_WEBHOOK_URL`

**Workflow ID:** `hjKwIjmuzvwgK9Xq` (update this)

**Test Webhook:** In n8n, click "Test" on Webhook node and paste test body above

**Check Logs:** Click "Executions" to see flow logs and debug

---

## ✅ Done!

After completing all steps, your workflow will:

- ✅ Accept new multi-order webhook payload
- ✅ Send separate messages per delivery date
- ✅ Show correct items and totals
- ✅ Send QRIS image
- ✅ Return success response

**Status:** Ready to update! Follow steps above. 🚀
