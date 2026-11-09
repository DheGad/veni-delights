# PRODUCT SCOPE — Veni Delights Digital Bakery Platform

**Version:** 2.0.0  
**Date:** 2026-11-09  
**Authority:** Chief Product Architect & Engineering Studio Lead

---

## 1. Executive Summary

Veni Delights is an artisanal homemade bakery based in Klang, Selangor, Malaysia. This project delivers an enterprise-grade, luxury digital bakery platform that transcends conventional static website design by integrating:
- **Interactive 3D Digital Human Bakery Avatars** (Veni Host, Master Baker, Dessert Specialist)
- **Deterministic Intelligent Virtual Concierge** (Guided product discovery & personalised recommendation engine)
- **Complete Verified Product Catalogue** across all 9 business categories
- **Interactive Dessert Corner & Event Quotation Engine** with real-time add-on calculations
- **Live Cake Customisation Studio** with instant visual feedback
- **Central Multi-Item WhatsApp Commerce Engine** with URL-safe encoding and strict input validation
- **Accessible, High-Performance Mobile & Desktop Web Experience**

---

## 2. Core Functional Modules

### Module 01: Hero & Cinematic Brand Showcase
- Background responsive fade slideshow featuring genuine bakery creations
- Luxury typography (Cormorant Garamond display + Poppins body)
- Dual conversion funnels: Direct Product Exploration (`#products`) and Instant WhatsApp Ordering

### Module 02: 3D Digital Human Avatar System (`src/js/avatar3d.js`)
- Three distinct avatars with contextual roles and bespoke uniform styling:
  1. **Veni Host:** Virtual Concierge, customer greeting, event guidance
  2. **Master Baker:** Butter series craftsmanship, brownies preparation, kitchen storytelling
  3. **Dessert Specialist:** Pavlova, tarts, and Dessert Corner package curation
- Skeletal natural breathing, procedural eye blink cycle, real-time mouse/touch gaze tracking
- Phoneme-synchronized mouth movement during speech
- Web Speech API narration with custom pitch/rate, user-controlled audio toggle, and animated subtitles
- Graceful low-power & reduced-motion fallback

### Module 03: Intelligent Veni Guide Concierge (`src/js/concierge.js`)
- Conversational 7-step guided journey:
  Occasion → Guest Count → Dessert Category → Flavour Preference → Budget → Recommendation Summary → WhatsApp Handshake
- Deterministic, verified recommendation engine that never hallucinates stock or prices
- Backtracking, restart, and skip controls for user autonomy

### Module 04: Master Product Catalogue (`src/js/products-ui.js`)
- Full representation of all 9 business categories:
  1. Butter Series (RM79)
  2. Brownies (RM59 + custom toppings)
  3. Pandan Layer Cake (8" RM69, 10" RM89)
  4. Pavlova Pudding Cake (5 flavours, RM88)
  5. Fruit Tart (RM3.00 / RM2.80 bulk 31+, min 10 pcs)
  6. Egg Tart (RM2.80 / RM2.50 bulk 31+, min 10 pcs)
  7. Cheese Tart (RM2.50 / RM2.00 bulk 101+, min 10 pcs, vegetarian option)
  8. Traditional Indian Desserts (Adhirasam, Kesari, Modagam — Contact for Pricing)
  9. Traditional Kuih Muih (Karipap, Kaswi, Ketayap, Lapis, Seri Muka, Wajik — Contact for Pricing)
- Dynamic category navigation pills, quick-order buttons, and order drawer integration

### Module 05: Dessert Corner Packages & Quotation Engine (`src/js/dessert-corner-ui.js`)
- Complete package representations:
  - Budget Package (RM200)
  - Package A (RM350)
  - Package B (RM550, Recommended)
  - Package C (RM750)
- Add-ons selector: Brownies Tower (RM100), Doll Jelly (RM30), Cupcakes (RM45), Pandan Layer Cake (RM80), Pavlova Pudding Cake (RM88)
- Real-time interactive subtotal computation
- Standardized booking policies (1 month advance, Klang Valley delivery, deposit requirements)

### Module 06: Cake Customisation Studio (`src/js/customise-ui.js`)
- Interactive cake customiser with live preview: base cake, occasion, custom text, quantity, colour scheme, date
- Transparent disclaimer separating virtual visualisations from final artisan confirmation

### Module 07: Multi-Item Order Cart & WhatsApp Handoff (`src/js/order-drawer.js` & `src/js/whatsapp.js`)
- Persistent client-side cart (`localStorage`)
- Quantity adjustment enforcing minimum order rules
- Detailed multi-item WhatsApp message builder with clean URL encoding
- Strict business telephone destination: `+60 12-336 0470` / `60123360470`

### Module 08: Gallery & Testimonials
- Responsive masonry grid displaying 30 authentic celebration photographs
- Accessible modal lightbox with keyboard shortcuts (ArrowLeft, ArrowRight, Escape)
- Testimonials slider showcasing 12 genuine customer review screenshots

### Module 09: FAQ & Verified Business Information
- Accessible accordion FAQ covering advance notice, delivery areas, dietary options, deposits, and payment methods
- Business hours (9:00 AM – 9:00 PM Daily)
- Payment methods: DuitNow, Bank Transfer, Touch 'n Go eWallet
