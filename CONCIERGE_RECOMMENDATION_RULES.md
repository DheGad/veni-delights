# CONCIERGE RECOMMENDATION RULES — Veni Delights

**Module Implementation:** `src/js/concierge.js`  
**Engine:** Deterministic Business Rule Graph (100% Verified, Zero Hallucination)

---

## 1. Core Rule Principles
1. **Never Invent Availability:** All recommended items link directly to confirmed products in `src/data/products.js`.
2. **Never Fabricate Pricing:** Prices displayed inside the conversation match the verified catalogue verbatim.
3. **Event-Scale Routing:**
   - Small Gatherings ($\le 15$ guests) $\rightarrow$ À la carte cakes, tarts, and brownies.
   - Medium to Large Events ($\ge 20$ guests) $\rightarrow$ Guided towards Dessert Corner Packages (Budget, A, B, C).
4. **Occasion-Specific Flavor Matching:**
   - Birthday $\rightarrow$ Red Velvet Butter Cake, Chocolate Brownies, Pavlova.
   - Traditional / Festive $\rightarrow$ Pandan Butter Cake, Pandan Layer Cake, Traditional Indian Sweets & Kuih.
   - Corporate $\rightarrow$ Brownie Platters, Assorted Cheese & Fruit Tarts (portionable finger-foods).

---

## 2. Decision Logic Graph

```
[Start: What are you looking for?]
  │
  ├── Celebration ──────> [Occasion?]
  │                         │
  │                         ├── Birthday ───────> [Guest Count?]
  │                         ├── Wedding ────────> [Guest Count?]
  │                         └── Corporate ──────> [Guest Count?]
  │                                                  │
  │                                                  ├── 1-15 guests  ──> À la Carte Recommendation
  │                                                  └── 20+ guests   ──> Dessert Corner Package
  │
  ├── Just a Treat ─────> [Product Preference?]
  │                         │
  │                         ├── Butter Cakes ───> Pure Butter / Red Velvet / Pandan
  │                         ├── Brownies ───────> Standard / Fresh Daily
  │                         ├── Pavlova ────────> Flavour Selector (Strawberry, Oreo, Mix Fruit)
  │                         └── Tarts ──────────> Cheese Tart (Min 10) / Fruit Tart (Min 10)
  │
  └── Dessert Corner ───> [Event Type & Package Selector] ──> Real-time Add-on Calculator
```

---

## 3. Fallbacks & Boundary Constraints
- Users can restart or skip questions at any step without state corruption.
- If a user completes an enquiry, the engine pre-fills an itemized WhatsApp draft ready for one-tap delivery.
