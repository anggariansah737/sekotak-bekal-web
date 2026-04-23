# n8n Workflow Update - Handle Multi-Date Orders

## 📋 Summary

Webhook payload structure **berubah**. Perlu update n8n workflow untuk handle `orders[]` array (bukan single order).

## ❌ Old Payload Format

```json
{
  "orderId": "order-123",
  "customerName": "John Doe",
  "customerPhone": "6285648444086",
  "items": [{ "name": "Item 1", "quantity": 2, "price": 28000 }],
  "totalAmount": 28000,
  "orderDate": "2026-04-24T..."
}
```

## ✅ New Payload Format

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
  "orderDate": "2026-04-24T..."
}
```

## 🔄 Changes Needed in n8n Workflow

### Current Workflow Flow (Old)

```
Webhook Trigger
  ↓
[Normalize Phone] - Extract & format phone
  ↓
[Code] - Build WhatsApp message with orderData
  ↓
[WAHA Send Text] - Send WhatsApp message
  ↓
[WAHA Send Image] - Send QRIS image
```

### New Workflow Flow (Updated)

```
Webhook Trigger
  ↓
[Code] - Extract & normalize phone, build message for each order
  ↓
[Loop Over orders[]] - Process each delivery date separately
  ├─ [Code] - Build WhatsApp message for this date's items
  ├─ [WAHA Send Text] - Send text message
  └─ [WAHA Send Image] - Send QRIS image
  ↓
[Set] - Return success response
```

## 📝 Detailed Steps

### Step 1: Modify Webhook Trigger (if needed)

**Webhook Node** - Should already accept the new payload. No changes needed if it's just receiving JSON.

### Step 2: Add Code Node to Parse Orders

Replace the current "Normalize Phone" logic with a new Code node:

```javascript
// Parse incoming webhook payload
const { customerName, customerPhone, orders, totalAmount, orderDate } =
  $input.all().body;

// Normalize phone number
let phone = customerPhone;
if (phone.startsWith("0")) {
  phone = "62" + phone.slice(1);
} else if (!phone.startsWith("62")) {
  phone = "62" + phone;
}

// Return parsed data
return {
  customerName,
  customerPhone: phone,
  orders: orders || [],
  totalAmount,
  orderDate,
  orderCount: orders ? orders.length : 0,
};
```

### Step 3: Loop Over Orders

Add an **"Execute for Each"** node (or Loop node) to process each order:

```
Set loop data: $.orders
```

This will iterate through each order in the `orders[]` array.

### Step 4: Build WhatsApp Message for Each Order

Inside the loop, add a Code node to format message per delivery date:

```javascript
// Current order from loop
const order = $input.all();
const { deliveryDate, items, subtotal } = order;
const { customerName, customerPhone, totalAmount } =
  $node["WebhookTrigger"].json;

// Format delivery date (e.g., "Rabu, 24 April 2026")
const date = new Date(deliveryDate);
const dayName = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"][
  date.getDay()
];
const monthName = [
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
][date.getMonth()];

// Build message
let message = `🍲 *Pesanan Dikonfirmasi*\n\n`;
message += `Halo ${customerName},\n\n`;
message += `📅 *Pengiriman: ${dayName}, ${date.getDate()} ${monthName} 2026*\n\n`;
message += `*Menu Pesanan:*\n`;

items.forEach((item) => {
  message += `• ${item.name} ×${item.quantity}\n`;
  message += `  Rp ${item.price.toLocaleString("id-ID")}\n`;
});

message += `\n*Subtotal*: Rp ${subtotal.toLocaleString("id-ID")}\n`;

// Show total only on last order
if ($loop.index === $node["WebhookTrigger"].json.orders.length - 1) {
  message += `\n💰 *Total Pembayaran*: Rp ${totalAmount.toLocaleString("id-ID")}\n`;
}

message += `\n✅ Tunjukkan QRIS di bawah untuk pembayaran.\n\n`;
message += `Terima kasih! 🙏`;

return {
  message,
  phone: customerPhone,
  deliveryDate,
};
```

### Step 5: Send WhatsApp Message

Use **WAHA Send Text** node with:

- **Phone**: `$input.json.phone`
- **Message**: `$input.json.message`

### Step 6: Send QRIS Image

Use **WAHA Send Image** node with:

- **Phone**: `$input.json.phone`
- **Image URL**: (your QRIS image URL)
- **Caption**: `Scan untuk bayar`

### Step 7: Return Response

Add **Set** node to return success:

```javascript
return {
  success: true,
  message: "All orders processed and notifications sent",
  ordersProcessed: $loop.data.length,
};
```

## 🧪 Testing

### Test with Sample Payload

Go to n8n webhook and test with this:

```json
{
  "customerName": "Test User",
  "customerPhone": "6285648444086",
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [{ "name": "Nasi Rendang Ayam", "quantity": 1, "price": 28000 }],
      "subtotal": 28000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [
        { "name": "Ayam Goreng Crispy", "quantity": 2, "price": 35000 }
      ],
      "subtotal": 70000
    }
  ],
  "totalAmount": 98000,
  "orderDate": "2026-04-24T10:30:00Z"
}
```

### Expected Behavior

Should receive **2 WhatsApp messages**:

1. First message: "Pengiriman Rabu, 24 April" + Nasi Rendang
2. Second message: "Pengiriman Kamis, 25 April" + Ayam Goreng (dengan Total Pembayaran)
3. QRIS image sent once per order (or once at end)

## 📋 Checklist

- [ ] Update Code node to parse new payload format
- [ ] Add Loop Over orders[]
- [ ] Update message formatting Code node
- [ ] Test with sample multi-date payload
- [ ] Verify WhatsApp messages received
- [ ] Check message formatting (dates, items, totals)
- [ ] Deploy updated workflow

## 💡 Alternative: Process All Orders in Single Message

If you want a **single message** with all orders grouped:

```javascript
const { customerName, customerPhone, orders, totalAmount } = $input.all().body;

let message = `🍲 *Pesanan Dikonfirmasi*\n\n`;
message += `Halo ${customerName},\n\n`;

orders.forEach((order) => {
  const date = new Date(order.deliveryDate);
  const dayName = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()];
  const monthName = [...]; // month names array

  message += `📅 *${dayName}, ${date.getDate()} ${monthName}*\n`;
  order.items.forEach((item) => {
    message += `• ${item.name} ×${item.quantity} - Rp ${item.price.toLocaleString('id-ID')}\n`;
  });
  message += `Subtotal: Rp ${order.subtotal.toLocaleString('id-ID')}\n\n`;
});

message += `💰 *Total*: Rp ${totalAmount.toLocaleString('id-ID')}\n`;
message += `Scan QRIS di bawah untuk bayar.\n\n`;
message += `Terima kasih! 🙏`;

return { message, phone: customerPhone };
```

Then no need for Loop node - just one Code → Send Text → Send Image.

## 🔗 Resources

- Current workflow: ID `hjKwIjmuzvwgK9Xq` (update this)
- Webhook URL: Check your `.env` file `VITE_N8N_WEBHOOK_URL`
- WAHA documentation: For WhatsApp node configuration

## ⚠️ Important Notes

1. **Phone number normalization**: Already handled in Code node
2. **Multiple messages**: One message per delivery date (if using Loop)
3. **QRIS image**: Send once per message, or once at the end
4. **Error handling**: Add error catch nodes for robustness
5. **Testing**: Always test with real phone number before going live

---

**Status**: Update ready. Follow steps above to modify n8n workflow. 🚀
