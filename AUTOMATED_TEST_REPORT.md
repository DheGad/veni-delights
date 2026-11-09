# AUTOMATED TEST REPORT — Veni Delights

**Test Runner:** Node.js Native Test Engine (`node:test`, `node:assert/strict`)  
**Test Suite File:** `test-suite.test.js`  
**Execution Timestamp:** 2026-11-09T12:56:45+08:00

---

## 1. Test Execution Summary

```
✔ Business information integrity (2.48ms)
✔ Butter Series pricing: all items must be RM79 (0.55ms)
✔ Brownies category price: RM59 standard (0.39ms)
✔ Pandan Layer Cake: 8 Inch is RM69, 10 Inch is RM89 (0.54ms)
✔ Pavlova Pudding Cake: all 5 flavours must be RM88 (0.73ms)
✔ Cheese Tart minimum order and bulk rate calculations (0.75ms)
✔ Fruit Tart minimum order and bulk rate calculations (0.42ms)
✔ Egg Tart minimum order and bulk rate calculations (0.35ms)
✔ Dessert Corner packages and add-ons verified data (0.56ms)
✔ WhatsApp URL builder correctness and security (0.91ms)
✔ WhatsApp Dessert Corner quotation URL builder (0.63ms)
✔ Order validation checks for empty cart and minimums (0.46ms)

ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 230.85ms
```

---

## 2. Test Verification Matrix

| Test ID | Scope | Verification Assertion | Result |
|---|---|---|---|
| **TEST-01** | Business Identity | Verified phone `012-336 0470`, WhatsApp `60123360470`, email `kagsivasiva15@gmail.com` | PASS |
| **TEST-02** | Butter Series | All 5 Butter Cakes priced at exactly RM79 | PASS |
| **TEST-03** | Brownies Series | Standard brownie is RM59; customized topping flagged as enquiry item | PASS |
| **TEST-04** | Pandan Layer Cake | 8" is RM69; 10" is RM89 | PASS |
| **TEST-05** | Pavlova Pudding | All 5 flavours (Orange, Strawberry, Mix Fruit, Laici, Oreo) verified at RM88 | PASS |
| **TEST-06** | Cheese Tart Tiers | Below 10 triggers minimum order error; 10-100 pcs priced at RM2.50; 101+ pcs priced at RM2.00 | PASS |
| **TEST-07** | Fruit Tart Tiers | Below 10 triggers error; 10-30 pcs priced at RM3.00; 31+ pcs priced at RM2.80 | PASS |
| **TEST-08** | Egg Tart Tiers | Below 10 triggers error; 10-30 pcs priced at RM2.80; 31+ pcs priced at RM2.50 | PASS |
| **TEST-09** | Dessert Corner | Budget (RM200), Pkg A (RM350), Pkg B (RM550), Pkg C (RM750), all 5 add-ons matched | PASS |
| **TEST-10** | WhatsApp Order URL | Correct destination `60123360470`, multi-item formatting, clean URI encoding | PASS |
| **TEST-11** | WhatsApp Event Quote | Correct event type, guest count, location, add-ons list | PASS |
| **TEST-12** | Cart Order Validator | Rejects empty cart, flags invalid quantities, validates minimum quantities | PASS |
