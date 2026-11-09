# BRAND DESIGN SYSTEM — Veni Delights

**Version:** 2.0.0  
**Design Authority:** Luxury Brand Designer & Senior UI/UX Specialist  
**Design Tokens Implementation:** `src/css/design-system.css`

---

## 1. Brand Identity & Heritage

Veni Delights is established on a foundation of home-baked love, warmth, authentic hospitality, and artisan craftsmanship in Klang Valley, Malaysia. The visual language blends the prestige of classical French/European patisseries with the cultural warmth of Malaysian home celebrations.

### Brand Values
- **Authenticity:** Genuine homemade recipes with high-grade butter, real fruits, and fresh ingredients.
- **Hospitality:** Warm, approachable, responsive customer communication.
- **Refinement:** Restrained luxury, gold accents against warm cream and deep charcoal/onyx surfaces.

---

## 2. Color Architecture

| Token Name | Hex Code | HSL / RGB | Intended Application |
|---|---|---|---|
| `--color-black` | `#0A0A08` | `rgb(10, 10, 8)` | Primary deep background, header, footer |
| `--color-black-soft` | `#111110` | `rgb(17, 17, 16)` | Elevated dark sections, avatar stage |
| `--color-black-card` | `#161614` | `rgb(22, 22, 20)` | Dark cards, concierge interface container |
| `--color-gold-antique` | `#C9A84C` | `rgb(201, 168, 76)` | Primary brand emblem gold, accents, borders |
| `--color-gold-champagne`| `#E8D5A3`| `rgb(232, 213, 163)` | Subtle gold text highlights, subtitles |
| `--color-gold-bright` | `#F0C860` | `rgb(240, 200, 96)` | Active states, hover glows, button focus rings |
| `--color-gold-dark` | `#8B6914` | `rgb(139, 105, 20)` | Deep gold outlines, button pressed states |
| `--color-ivory` | `#FAF7F0` | `rgb(250, 247, 240)` | High-contrast text on dark backgrounds |
| `--color-cream` | `#F5EDD8` | `rgb(245, 237, 216)` | Warm product browsing background, secondary badges |
| `--color-brown-chocolate`| `#3D1F0D`| `rgb(61, 31, 13)` | Brownies category accent, footer text accents |
| `--surface-warm` | `#FDF8F0` | `rgb(253, 248, 240)` | Editorial product browsing section background |

---

## 3. Typography Hierarchy

### Display Typeface: Cormorant Garamond
- **Classification:** Classical Serif
- **Usage:** Headings (`h1`, `h2`, `h3`, `h4`), prices, display quotes
- **Weights:** Light (300), Regular (400), SemiBold (600)
- **Tracking:** `-0.025em` to `0.025em`

### Body Typeface: Poppins
- **Classification:** Geometric Sans-Serif
- **Usage:** Body paragraphs, navigation links, buttons, inputs, labels, descriptions
- **Weights:** Regular (400), Medium (500), SemiBold (600)
- **Line Heights:** 1.5 to 1.65 for optimal readability

---

## 4. Spacing, Borders & Radius Scale

- **Radius Scales:**
  - `var(--radius-sm)` (4px): Button corners, badges
  - `var(--radius-md)` (8px): Form inputs, quantity counters
  - `var(--radius-lg)` (12px): Product cards, gallery items
  - `var(--radius-xl)` (16px): Dessert corner package cards
  - `var(--radius-2xl)` (24px): Concierge dialogue interface, avatar card
  - `var(--radius-full)` (9999px): Pills, floating WhatsApp button

---

## 5. Motion Tokens
- Standard duration: `250ms` (hover states)
- Cinematic duration: `600ms` - `900ms` (reveals)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (smooth luxury deceleration)
- Media Query: `@media (prefers-reduced-motion: reduce)` fully disables non-essential animations.
