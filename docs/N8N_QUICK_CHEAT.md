# n8n Workflow Update - Quick Cheat Sheet

## 🎯 In 60 Seconds

**What:** Add support for multiple orders per webhook  
**Why:** Customer can order from different delivery dates  
**How:** Add Loop + Update Message formatting  
**Time:** 30 minutes

---

## 🔧 7 Nodes You Need

```
1. Webhook           ← Already exists, no changes
2. Parse Payload     ← NEW: Code node
3. Loop Over Orders  ← NEW: Execute For Each node
4. Build Message     ← UPDATE: existing Code node
5. WAHA Send Text    ← Already exists, keep same
6. WAHA Send Image   ← Already exists, keep same
7. Return Response   ← NEW: Set node
```

---

## 📝 Copy-Paste Code for Node 2: Parse Payload

```javascript
const { customerName, customerPhone, orders, totalAmount, orderDate } =
  $input.all().body;
let phone = customerPhone || "";
if (phone.startsWith("0")) phone = "62" + phone.slice(1);
else if (!phone.startsWith("62")) phone = "62" + phone;

return {
  customerName: customerName || "Customer",
  phone,
  orders: orders || [],
  totalAmount: totalAmount || 0,
  orderDate: orderDate || new Date().toISOString(),
  orderCount: orders ? orders.length : 0,
};
```

---

## 📝 Copy-Paste Config for Node 3: Loop Over Orders

**Node Type:** Execute For Each  
**Loop List:** `{{ $node.parsePayload.json.orders }}`

That's it!

---

## 📝 Copy-Paste Code for Node 4: Build Message

```javascript
const order = $input.all();
const { deliveryDate, items, subtotal } = order;
const { customerName, phone, totalAmount, orderCount } =
  $node.parsePayload.json;

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

let msg = "🍲 *Pesanan Dikonfirmasi*\n\n";
msg += `Halo ${customerName},\n\n`;
msg += `📅 *Pengiriman: ${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} 2026*\n\n`;
msg += "*Menu Pesanan:*\n";

items.forEach((item) => {
  msg += `• ${item.name} ×${item.quantity}\n  Rp ${item.price.toLocaleString("id-ID")}\n`;
});

msg += `\n*Subtotal*: Rp ${subtotal.toLocaleString("id-ID")}\n`;

const isLast = $loop.index === orderCount - 1;
if (isLast)
  msg += `\n💰 *Total Pembayaran*: Rp ${totalAmount.toLocaleString("id-ID")}\n`;

msg += "\n✅ Tunjukkan QRIS di bawah untuk pembayaran.\n\nTerima kasih! 🙏";

return { message: msg, phone, deliveryDate, isLast };
```

---

## 🔗 Node Connections

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
  Phone: {{ $node.buildMessage.json.phone }}
  Message: {{ $node.buildMessage.json.message }}
  ↓
WAHA Send Image
  Phone: {{ $node.buildMessage.json.phone }}
  Image: https://sekotak.app/qris.jpg
  ↓
Return Response
  success: true
  message: "All orders processed"
  ordersCount: {{ $node.parsePayload.json.orderCount }}
```

---

## 🧪 Test Payload

```json
{
  "customerName": "Test User",
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

**Expected:** 2 WhatsApp messages + 2 QRIS images ✅

---

## ⚙️ Node Configurations

### Node 2: Parse Payload

- Type: Code
- Language: JavaScript
- Paste the code from above

### Node 3: Loop Over Orders

- Type: Execute For Each
- List to loop over: `{{ $node.parsePayload.json.orders }}`

### Node 4: Build Message

- Type: Code
- Language: JavaScript
- Paste the code from above

### Node 5: WAHA Send Text (Already exists)

- Phone: `{{ $node.buildMessage.json.phone }}`
- Message: `{{ $node.buildMessage.json.message }}`
- No changes needed

### Node 6: WAHA Send Image (Already exists)

- Phone: `{{ $node.buildMessage.json.phone }}`
- Image: `https://sekotak.app/qris.jpg` (your QRIS URL)
- Caption: `Scan untuk bayar`
- No changes needed

### Node 7: Return Response

- Type: Set
- Add assignments:
  - `success` = `true`
  - `message` = `"All orders processed"`
  - `ordersCount` = `{{ $node.parsePayload.json.orderCount }}`

---

## ✅ Quick Checklist

- [ ] Node 2 code added
- [ ] Node 3 loop configured
- [ ] Node 4 code updated
- [ ] All nodes connected
- [ ] Tested with test payload
- [ ] Got 2 WhatsApp messages
- [ ] QRIS images sent
- [ ] Workflow published

---

## 🐛 Troubleshooting in 30 Seconds

**No messages?**
→ Check WAHA connection + phone number format

**Wrong date format?**
→ Ensure `deliveryDate` is ISO: `YYYY-MM-DD`

**Loop not running?**
→ Verify `orders` array exists in payload

**Total showing on every message?**
→ Check `if (isLast)` condition in Build Message

**Messages out of order?**
→ Normal - WAHA sends asynchronously

---

## 📚 For More Help

- **Detailed steps:** See N8N_STEP_BY_STEP.md
- **Visual guide:** See N8N_WORKFLOW_DIAGRAM.txt
- **Full reference:** See N8N_UPDATE.md

---

## 🚀 Ready?

1. Open n8n
2. Copy Node 2, 3, 4 code above
3. Paste into nodes
4. Test with test payload
5. Publish
6. Done! ✅

**Est. time: 20 minutes**
