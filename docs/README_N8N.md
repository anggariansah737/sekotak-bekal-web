# n8n Workflow Update Documentation

## 📚 Choose Your Style

### ⚡ In a Hurry?

→ **N8N_QUICK_CHEAT.md** (5 min)

- Just the code to copy-paste
- 7 nodes to configure
- Test payload included
- Perfect if you know n8n

### 🎯 Step-by-Step?

→ **N8N_STEP_BY_STEP.md** (30 min)

- Complete walkthrough
- 9 detailed steps
- Screenshots-ready descriptions
- Good for beginners

### 👁️ Visual Learner?

→ **N8N_WORKFLOW_DIAGRAM.txt** (10 min)

- ASCII diagrams
- Data flow visualization
- Execution traces
- Node descriptions

### 📖 Need Everything?

→ **N8N_UPDATE.md** (15 min)

- Comprehensive reference
- All context + code
- Alternatives & options
- Q&A section

### 📋 TL;DR Summary?

→ **N8N_SUMMARY.md** (5 min)

- Overview of changes
- Key 3 changes highlighted
- Links to detailed docs
- Pro tips & checklist

---

## 🎯 Quick Decision Matrix

| Your Situation      | Read This                | Time   |
| ------------------- | ------------------------ | ------ |
| I know n8n well     | N8N_QUICK_CHEAT.md       | 5 min  |
| I'm new to n8n      | N8N_STEP_BY_STEP.md      | 30 min |
| I like diagrams     | N8N_WORKFLOW_DIAGRAM.txt | 10 min |
| I want full details | N8N_UPDATE.md            | 15 min |
| I'm in a rush       | N8N_SUMMARY.md           | 5 min  |

---

## 📊 What Changed

### Old Webhook (Single Order)

```json
{
  "orderId": "abc123",
  "items": [...],
  "totalAmount": 28000
}
```

→ 1 WhatsApp message

### New Webhook (Multiple Orders)

```json
{
  "orders": [
    {"deliveryDate": "2026-04-24", "items": [...], "subtotal": 28000},
    {"deliveryDate": "2026-04-25", "items": [...], "subtotal": 70000}
  ],
  "totalAmount": 98000
}
```

→ 2 WhatsApp messages (one per delivery date)

---

## 🔄 Workflow Changes Required

### Before (Old)

```
Webhook → Normalize Phone → Code → WAHA Send Text → WAHA Send Image
(Handles 1 order)
```

### After (New)

```
Webhook → Parse Payload → Loop → Build Message → WAHA Send Text → WAHA Send Image
(Handles N orders, loops N times)
```

---

## 🚀 The 3 Key Updates

### 1. Add "Parse Payload" Node

Extract webhook data and normalize phone number

### 2. Add "Loop Over Orders" Node

Iterate through each order in the `orders[]` array

### 3. Update "Build Message" Node

Format message per delivery date instead of single order

---

## 📝 Test Payload

All documentation includes this test payload - use it to verify your changes:

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

**Expected Result:** 2 WhatsApp messages ✅

---

## ✅ Verification Checklist

- [ ] Nodes 2, 3, 4 added/updated
- [ ] All 7 nodes connected in order
- [ ] Tested with test payload
- [ ] 2 WhatsApp messages received
- [ ] Date formatting correct
- [ ] Total shown only on last message
- [ ] QRIS images sent
- [ ] Workflow published

---

## 🎓 Learning Path

**Never used n8n?**

1. Read: N8N_STEP_BY_STEP.md
2. Follow: Each of the 9 steps
3. Test: Use provided test payload
4. Verify: Check WhatsApp delivery

**Used n8n before?**

1. Read: N8N_QUICK_CHEAT.md
2. Copy-paste: Code for 3 nodes
3. Configure: Node settings
4. Test & deploy

**Like visuals?**

1. View: N8N_WORKFLOW_DIAGRAM.txt
2. Compare: Your flow vs. diagram
3. Reference: Node descriptions
4. Code: Copy from QUICK_CHEAT

---

## 📞 Support Flow

**Got an error?**
→ N8N_STEP_BY_STEP.md has Troubleshooting section

**Not sure about a node?**
→ N8N_WORKFLOW_DIAGRAM.txt describes each node

**Want full context?**
→ N8N_UPDATE.md has everything

**In a rush?**
→ N8N_QUICK_CHEAT.md gets you there fastest

---

## 🔗 Related Documentation

In the same `docs/` folder:

- **SETUP_GUIDE.md** - Menu per-day feature setup
- **IMPLEMENTATION_SUMMARY.md** - Backend architecture
- **QUICK_START.md** - Feature overview

---

## 🎯 Your Workflow ID

The workflow you're updating:

```
ID: hjKwIjmuzvwgK9Xq
Type: Sekotak Order Webhook Handler
```

Webhook URL (check your `.env`):

```
VITE_N8N_WEBHOOK_URL=https://n8n-...terong.sumopod.my.id/webhook/sekotak-order
```

---

## ⏱️ Time Estimates

| Document       | Read Time | Implementation Time | Total      |
| -------------- | --------- | ------------------- | ---------- |
| QUICK_CHEAT    | 5 min     | 15 min              | **20 min** |
| STEP_BY_STEP   | 15 min    | 20 min              | **35 min** |
| DIAGRAM        | 5 min     | 25 min              | **30 min** |
| FULL_REFERENCE | 10 min    | 20 min              | **30 min** |

---

## 🎉 After You're Done

1. ✅ n8n updated for multi-order webhook
2. ✅ Tested with sample data
3. ✅ Deployed to production
4. Next: Test from the actual app with multi-date order

---

## 🏁 Start Here

Choose based on your comfort level:

👶 **Complete beginner?**
→ Start with **N8N_STEP_BY_STEP.md** (30 min, step-by-step)

🏃 **Experienced?**
→ Start with **N8N_QUICK_CHEAT.md** (20 min, copy-paste)

🎨 **Visual person?**
→ Start with **N8N_WORKFLOW_DIAGRAM.txt** (30 min, with diagrams)

---

## 📌 Key Points to Remember

1. **Loop is essential** - Process each order separately
2. **Date formatting** - Rabu, 24 April format (not ISO)
3. **Total amount** - Show only on last order (`isLast` check)
4. **Phone normalization** - 0... → 62... format
5. **Test first** - Always test before publishing

---

## ✨ What You're Building

A workflow that:

- ✅ Receives multi-date orders
- ✅ Sends separate WhatsApp per delivery date
- ✅ Shows correct items & subtotals per date
- ✅ Shows total amount only once (on last message)
- ✅ Sends QRIS payment image
- ✅ Works for 1+ orders

---

**Pick a document above and start updating! 🚀**

All docs are in the same folder as this file.
