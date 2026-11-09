# CAKE CUSTOMISATION SPECIFICATION — Veni Delights

**Module Implementation:** `src/js/customise-ui.js`  
**Section Target:** `#customise`

---

## 1. Specification Overview
The cake customisation studio enables customers to personalize celebration cakes while upholding strict business reality. The interface provides instant live visual updates without making impossible promises regarding stock or design feasibility.

---

## 2. Configurable Dimensions

| Dimension | Supported Options | Validation Rules |
|---|---|---|
| **Base Cake** | Pure Butter (RM79), Orange Butter (RM79), Butter Marble (RM79), Red Velvet (RM79), Pandan Butter (RM79), Pandan Layer 8" (RM69), Pandan Layer 10" (RM89) | Required select |
| **Occasion** | Birthday, Wedding, Anniversary, Baby Shower, Corporate, Festive, Personal | Optional select |
| **Custom Inscription** | Text string (e.g. "Happy 30th Birthday Priya 🎂") | Max length: 60 characters |
| **Quantity** | Numeric integer (default 1) | Min 1, Max 50 |
| **Colour Theme** | Free-form descriptor (e.g. "Rose Gold & White") | Max length: 60 characters |
| **Special Requests** | Detailed instructions (dietary, decorations) | Max length: 300 characters |
| **Target Date** | Date picker | Must adhere to minimum 5-day advance order policy |
| **Customer Name** | Full name text | Required for quotation draft |

---

## 3. Disclaimers & Production Reality
- Clearly states: *"Visual preview is indicative only. Final design subject to discussion and confirmation with Veni Delights."*
- Reminds customer: *"Please allow a minimum of 5 days advance notice for à la carte orders."*
