# n8n Workflow Update Summary

## 📋 What Changed

Your app now sends **multiple orders per webhook** (one per delivery date).

### Old Way

```
Customer orders:
  - 2026-04-24: Nasi Rendang (Rp 28.000)

Webhook sends: 1 order
n8n sends: 1 WhatsApp message
```

### New Way

```
Customer orders:
  - 2026-04-24: Nasi Rendang (Rp 28.000)
  - 2026-04-25: Ayam Goreng (Rp 70.000)

Webhook sends: 2 orders (grouped by delivery date)
n8n sends: 2 WhatsApp messages (one per delivery date)
```

---

## 🚀 What You Need to Do

Update your n8n workflow to handle the new `orders[]` array format.

### Quick Reference

**Old Webhook Structure:**

```json
{
  "orderId": "abc123",
  "items": [...],
  "totalAmount": 28000
}
```

**New Webhook Structure:**

```json
{
  "orders": [
    {
      "deliveryDate": "2026-04-24",
      "items": [...],
      "subtotal": 28000
    },
    {
      "deliveryDate": "2026-04-25",
      "items": [...],
      "subtotal": 70000
    }
  ],
  "totalAmount": 98000
}
```

---

## 📚 Documentation Files

Choose one based on your preference:

| Document                     | Best For           | Time   |
| ---------------------------- | ------------------ | ------ |
| **N8N_STEP_BY_STEP.md**      | Complete beginners | 30 min |
| **N8N_UPDATE.md**            | Detailed reference | 15 min |
| **N8N_WORKFLOW_DIAGRAM.txt** | Visual learners    | 10 min |

---

## ⚡ TL;DR - 3 Main Changes

### 1️⃣ Add "Parse Payload" Code Node

After Webhook, extract and normalize the new payload:

```javascript
const { customerName, customerPhone, orders, totalAmount } = $input.all().body;
let phone = customerPhone.startsWith("0")
  ? "62" + customerPhone.slice(1)
  : customerPhone;
return {
  customerName,
  phone,
  orders: orders || [],
  totalAmount,
  orderCount: orders.length,
};
```

### 2️⃣ Add "Loop Over Orders" Node

Loop through each order to send separate messages:

```
Loop List: {{ $node.parsePayload.json.orders }}
```

### 3️⃣ Update "Build Message" Code Node

For each order, format the WhatsApp message with delivery date:

```javascript
const { deliveryDate, items, subtotal } = $input.all();
const { customerName, phone, totalAmount, orderCount } =
  $node.parsePayload.json;

let message = "🍲 *Pesanan Dikonfirmasi*\n\n";
message += `Halo ${customerName},\n\n`;
message += `📅 *Pengiriman: ${formatDate(deliveryDate)}*\n\n`;

items.forEach((item) => {
  message += `• ${item.name} ×${item.quantity}\n`;
});

message += `\nSubtotal: Rp ${subtotal.toLocaleString("id-ID")}\n`;

// Show total only on last order
if ($loop.index === orderCount - 1) {
  message += `\n💰 *Total*: Rp ${totalAmount.toLocaleString("id-ID")}\n`;
}

return { message, phone };
```

---

## 🔄 Workflow Flow

```
Webhook Trigger
    ↓
Parse Payload (extract & normalize)
    ↓
Loop Over Orders (iterate N times)
    ↓
Build Message (format per delivery date)
    ↓
WAHA Send Text (WhatsApp message)
    ↓
WAHA Send Image (QRIS)
    ↓
Return Response
```

---

## ✅ Testing

### Test Payload (2 Orders)

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
      "items": [{ "name": "Ayam Goreng", "quantity": 2, "price": 35000 }],
      "subtotal": 70000
    }
  ],
  "totalAmount": 98000,
  "orderDate": "2026-04-24T10:30:00Z"
}
```

### Expected Result

✅ 2 WhatsApp messages received:

1. Message 1: "Pengiriman Rabu, 24 April" + Nasi Rendang details
2. Message 2: "Pengiriman Kamis, 25 April" + Ayam Goreng details + TOTAL
   ✅ QRIS images received (2x)

---

## 🛠 Detailed Steps

See **N8N_STEP_BY_STEP.md** for complete step-by-step guide including:

- Node configuration details
- Code snippets to copy-paste
- Troubleshooting section
- Testing checklist

---

## 📊 Visual Diagram

See **N8N_WORKFLOW_DIAGRAM.txt** for:

- Complete workflow visualization
- Node descriptions
- Data flow examples
- Execution trace

---

## 🔗 Key Points

### Why This Change?

When customer orders from multiple dates, they get separate orders in the database (one per `delivery_date`). So the webhook should send multiple orders too - one WhatsApp message per delivery date.

### Important Logic

**Show Total Amount Only on Last Message:**

```javascript
if ($loop.index === $node.parsePayload.json.orderCount - 1) {
  // This is the last order, show total
  message += `💰 *Total Pembayaran*: Rp ${totalAmount}`;
}
```

This way, customers see:

- Message 1: Delivery Date 1, Items, Subtotal
- Message 2: Delivery Date 2, Items, Subtotal, **TOTAL**

---

## 📝 Checklist Before Deploy

- [ ] Webhook node configured (no changes needed)
- [ ] Parse Payload code added & tested
- [ ] Loop Over Orders node added
- [ ] Build Message code updated with new format
- [ ] WAHA Send Text node connected
- [ ] WAHA Send Image node connected
- [ ] Return Response node added
- [ ] Tested with single-order payload
- [ ] Tested with multi-order payload
- [ ] Messages formatted correctly
- [ ] Dates showing correctly
- [ ] Total amount shows only on last message
- [ ] QRIS images sending
- [ ] Workflow published/active

---

## 🎯 Next Steps

1. **Read**: Choose documentation based on your preference
   - Beginners → N8N_STEP_BY_STEP.md
   - Visual → N8N_WORKFLOW_DIAGRAM.txt
   - Reference → N8N_UPDATE.md

2. **Update**: Modify n8n workflow following the guide

3. **Test**: Use the test payload provided

4. **Deploy**: Publish the updated workflow

5. **Verify**: Test from the app with multi-date order

---

## 💡 Pro Tips

- **Test first**: Use n8n "Test" button before publishing
- **Check logs**: "Executions" tab shows detailed logs for debugging
- **Save drafts**: n8n auto-saves, but manually save before publishing
- **Monitor**: Check WhatsApp delivery status in WAHA logs
- **Iterate**: Can update and test without affecting prod (if you have staging)

---

## ❓ Common Questions

**Q: Will this break existing single-order logic?**
A: No, the code handles both. Single order still works.

**Q: Can I send all orders in one message instead?**
A: Yes! See N8N_UPDATE.md "Alternative" section for single-message approach.

**Q: How do I know if messages were sent?**
A: Check n8n Executions tab → see status + WAHA logs

**Q: What if a customer orders 5 different dates?**
A: Loop executes 5 times, sends 5 messages. Customer receives all.

---

## 🚀 You're Ready!

Everything is documented. Pick your style and get updating. DM me if you hit any issues!

**Time to complete:** 30 minutes
**Difficulty:** Medium (mostly copy-paste + configuration)
**Result:** Multi-date orders working end-to-end!
