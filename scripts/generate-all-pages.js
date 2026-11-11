import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, DESSERT_CORNER, FAQ, BUSINESS } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Helper to render individual product card
function renderProductCard(item) {
  const isEnquiry = item.isEnquiry || !item.price;
  const minQty = item.minimumOrder || 1;
  const waUrl = item.whatsappText ? `https://wa.me/60123360470?text=${encodeURIComponent(item.whatsappText)}` : 'https://wa.me/60123360470';

  return `
    <article class="product-card" data-reveal>
      <div class="product-card-img-wrap">
        <img src="${item.image}" alt="${item.alt || item.name}" class="product-card-img" loading="lazy">
        <div class="product-card-badges">
          ${item.tags ? item.tags.map(t => `<span class="badge badge-gold">${t}</span>`).join('') : ''}
        </div>
        ${!isEnquiry ? `
          <div class="product-card-add-overlay">
            <button class="product-card-add-btn add-to-cart" title="Add to Order Builder" aria-label="Add ${item.name} to order" data-product-id="${item.id}">
              <i class="fa-solid fa-plus" aria-hidden="true"></i>
            </button>
          </div>
        ` : ''}
      </div>
      <div class="product-card-body">
        <h4 class="product-card-name">${item.name}</h4>
        ${item.variant ? `<span class="product-card-variant">${item.variant}</span>` : ''}
        <p class="product-card-desc">${item.description || ''}</p>
        <div class="product-card-price-wrap">
          <span class="product-card-price ${isEnquiry ? 'product-card-price-enquiry' : ''}">
            ${item.priceDisplay || (item.price ? `RM${item.price}` : 'Contact for Pricing')}
          </span>
          ${item.bulkPriceDisplay ? `
            <div style="font-size:0.75rem; color:var(--color-primary); font-weight:500;">
              ${item.bulkPriceDisplay}
            </div>
          ` : ''}
        </div>
        <div class="product-card-actions">
          <a href="${waUrl}"
             class="btn btn-primary direct-wa-btn"
             target="_blank" rel="noopener noreferrer"
             aria-label="Order ${item.name} via WhatsApp">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            ${isEnquiry ? 'Enquire' : 'Order'}
          </a>
          ${!isEnquiry ? `
            <button class="btn btn-secondary add-drawer-btn" aria-label="Add ${item.name} to order builder" data-product-id="${item.id}">
              <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
            </button>
          ` : ''}
        </div>
      </div>
    </article>
  `;
}

// Common Shared Header / Navbar
function renderNavbar(activePage = '') {
  return `
<header class="navbar" id="navbar" role="banner">
  <div class="navbar-inner container">
    <a href="index.html" class="navbar-logo" aria-label="Veni Delights — Home">
      <img src="images/logo/logo.jpg" alt="Veni Delights Logo" class="navbar-logo-img" width="56" height="56">
      <span class="navbar-logo-name">Veni Delights</span>
    </a>

    <nav class="navbar-nav" aria-label="Main navigation">
      <a href="index.html" class="nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
      <a href="about.html" class="nav-link ${activePage === 'about' ? 'active' : ''}">About</a>
      <a href="products.html" class="nav-link ${activePage === 'products' ? 'active' : ''}">Products</a>
      <a href="dessert-corner.html" class="nav-link ${activePage === 'dessert-corner' ? 'active' : ''}">Dessert Corner</a>
      <a href="customise.html" class="nav-link ${activePage === 'customise' ? 'active' : ''}">Customise</a>
      <a href="concierge.html" class="nav-link ${activePage === 'concierge' ? 'active' : ''}">Concierge</a>
      <a href="gallery.html" class="nav-link ${activePage === 'gallery' ? 'active' : ''}">Gallery</a>
      <a href="reviews.html" class="nav-link ${activePage === 'reviews' ? 'active' : ''}">Reviews</a>
      <a href="faq.html" class="nav-link ${activePage === 'faq' ? 'active' : ''}">FAQ</a>
      <a href="contact.html" class="nav-link ${activePage === 'contact' ? 'active' : ''}">Contact</a>
    </nav>

    <div class="navbar-actions">
      <button class="btn btn-secondary btn-sm navbar-cart-btn" id="open-order-builder" aria-label="Open Order Cart">
        <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
        <span class="cart-label hide-mobile">Cart</span>
      </button>

      <a href="https://wa.me/60123360470?text=Hello%20Veni%20Delights!%20I'd%20like%20to%20place%20an%20order."
         class="btn btn-primary btn-sm navbar-cta hide-mobile"
         target="_blank"
         rel="noopener noreferrer"
         aria-label="Order via WhatsApp">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        WhatsApp
      </a>
      
      <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>
  </div>

  <nav class="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" aria-hidden="true">
    <a href="index.html" class="mobile-nav-link ${activePage === 'home' ? 'active' : ''}">Home</a>
    <a href="about.html" class="mobile-nav-link ${activePage === 'about' ? 'active' : ''}">About Artisan</a>
    <a href="products.html" class="mobile-nav-link ${activePage === 'products' ? 'active' : ''}">All Products</a>
    <a href="butter-cakes.html" class="mobile-nav-link ${activePage === 'butter-cakes' ? 'active' : ''}">Butter Series (RM79)</a>
    <a href="brownies.html" class="mobile-nav-link ${activePage === 'brownies' ? 'active' : ''}">Brownies & Towers</a>
    <a href="pandan-layer.html" class="mobile-nav-link ${activePage === 'pandan-layer' ? 'active' : ''}">Pandan Layer Cake</a>
    <a href="pavlova.html" class="mobile-nav-link ${activePage === 'pavlova' ? 'active' : ''}">Pavlova Cakes (RM88)</a>
    <a href="cheese-tarts.html" class="mobile-nav-link ${activePage === 'cheese-tarts' ? 'active' : ''}">Cheese Tarts</a>
    <a href="fruit-tarts.html" class="mobile-nav-link ${activePage === 'fruit-tarts' ? 'active' : ''}">Fruit Tarts</a>
    <a href="egg-tarts.html" class="mobile-nav-link ${activePage === 'egg-tarts' ? 'active' : ''}">Egg Tarts</a>
    <a href="dessert-corner.html" class="mobile-nav-link ${activePage === 'dessert-corner' ? 'active' : ''}">Dessert Corner Catering</a>
    <a href="customise.html" class="mobile-nav-link ${activePage === 'customise' ? 'active' : ''}">Customise Studio</a>
    <a href="concierge.html" class="mobile-nav-link ${activePage === 'concierge' ? 'active' : ''}">Veni Concierge</a>
    <a href="gallery.html" class="mobile-nav-link ${activePage === 'gallery' ? 'active' : ''}">Gallery</a>
    <a href="reviews.html" class="mobile-nav-link ${activePage === 'reviews' ? 'active' : ''}">Reviews</a>
    <a href="faq.html" class="mobile-nav-link ${activePage === 'faq' ? 'active' : ''}">FAQ</a>
    <a href="contact.html" class="mobile-nav-link ${activePage === 'contact' ? 'active' : ''}">Contact & Delivery</a>
    <a href="order.html" class="mobile-nav-link ${activePage === 'order' ? 'active' : ''}">Review Order / Checkout</a>
    <a href="https://wa.me/60123360470?text=Hello%20Veni%20Delights!%20I'd%20like%20to%20place%20an%20order."
       class="btn btn-whatsapp btn-full mobile-nav-wa"
       target="_blank" rel="noopener noreferrer">
      <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
      Order via WhatsApp
    </a>
  </nav>
</header>
  `;
}

// Common Shared Order Drawer
function renderOrderDrawer() {
  return `
<div class="order-drawer" id="order-drawer" role="dialog" aria-modal="true" aria-label="Order builder" aria-hidden="true">
  <div class="order-drawer-overlay" id="order-drawer-overlay"></div>
  <div class="order-drawer-panel">
    <div class="order-drawer-header">
      <h3><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> Your Order Builder</h3>
      <button class="order-drawer-close" id="order-drawer-close" aria-label="Close order builder">
        <i class="fa-solid fa-times" aria-hidden="true"></i>
      </button>
    </div>
    
    <div class="order-drawer-body" id="order-drawer-body">
      <div class="order-drawer-empty" id="order-drawer-empty">
        <i class="fa-solid fa-shopping-basket" aria-hidden="true"></i>
        <p>Your order is empty. Browse our products and add items to get started.</p>
        <a href="products.html" class="btn btn-primary" id="order-browse-btn">Browse Products</a>
      </div>
    </div>

    <div class="order-drawer-details" id="order-drawer-details" hidden>
      <div class="form-group">
        <label for="order-name" class="form-label">Your Name</label>
        <input type="text" id="order-name" class="form-input" placeholder="Your name" autocomplete="name" maxlength="80">
      </div>
      <div class="form-group">
        <label for="order-date" class="form-label">Preferred Date (Min 5 Days Notice)</label>
        <input type="date" id="order-date" class="form-input">
      </div>
      <div class="form-group">
        <label for="order-delivery" class="form-label">Pickup / Delivery</label>
        <select id="order-delivery" class="form-select">
          <option value="">Select preference...</option>
          <option>Self Pickup (Klang)</option>
          <option>Grab Express</option>
          <option>Lalamove</option>
          <option>Delivery (please advise on location)</option>
        </select>
      </div>
      <div class="form-group">
        <label for="order-instructions" class="form-label">Special Instructions / Inscription (Optional)</label>
        <textarea id="order-instructions" class="form-textarea" rows="2" placeholder="e.g. Happy 30th Birthday Priya! Extra candles..." maxlength="300"></textarea>
      </div>
    </div>

    <div class="order-drawer-footer" id="order-drawer-footer">
      <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-weight:600; font-size:1.1rem; color:#FAF7F0;">
        <span>Order Total:</span>
        <span id="order-drawer-total">RM0.00</span>
      </div>
      <button class="btn btn-whatsapp btn-full btn-lg" id="order-wa-btn" disabled aria-label="Send order via WhatsApp">
        <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
        Send Order via WhatsApp
      </button>
      <div style="margin-top:10px; text-align:center;">
        <a href="order.html" class="btn btn-secondary btn-sm" style="width:100%;">
          <i class="fa-solid fa-list-check"></i> Open Full Checkout Page
        </a>
      </div>
      <p class="order-wa-disclaimer">WhatsApp will open with your order details. The order is only confirmed after Veni Delights replies.</p>
    </div>
  </div>
</div>
  `;
}

// Common Shared Footer
function renderFooter() {
  return `
<footer class="footer" role="contentinfo">
  <div class="footer-top">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="footer-logo-link" aria-label="Veni Delights — Home">
            <img src="images/logo/logo.jpg" alt="Veni Delights Logo" class="footer-logo" width="70" height="70" loading="lazy">
          </a>
          <h3 class="footer-brand-name">Veni Delights</h3>
          <p class="footer-brand-tagline">Freshly Homemade. Beautifully Crafted.</p>
          <p class="footer-brand-desc">Premier artisan patisserie in Klang, Selangor. 100% pure European butter, fresh pandan, and bespoke celebration dessert tables.</p>
          <div class="footer-social">
            <a href="https://www.instagram.com/veni_delights_hq" target="_blank" rel="noopener noreferrer" aria-label="Instagram" class="footer-social-link">
              <i class="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="https://www.tiktok.com/@veni_delights_hq" target="_blank" rel="noopener noreferrer" aria-label="TikTok" class="footer-social-link">
              <i class="fa-brands fa-tiktok" aria-hidden="true"></i>
            </a>
            <a href="https://www.facebook.com/veni_delights_hq" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="footer-social-link">
              <i class="fa-brands fa-facebook" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        <div class="footer-nav-col">
          <h4 class="footer-col-title">Navigation</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About Artisan</a></li>
            <li><a href="products.html">All Products</a></li>
            <li><a href="dessert-corner.html">Dessert Corner</a></li>
            <li><a href="customise.html">Customise Studio</a></li>
            <li><a href="concierge.html">Veni Concierge</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="reviews.html">Customer Reviews</a></li>
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="contact.html">Contact & Location</a></li>
          </ul>
        </div>

        <div class="footer-nav-col">
          <h4 class="footer-col-title">Signature Cakes</h4>
          <ul class="footer-links">
            <li><a href="butter-cakes.html">Butter Series (RM79)</a></li>
            <li><a href="brownies.html">Fudge Brownies (RM59)</a></li>
            <li><a href="pandan-layer.html">Pandan Layer (RM69/89)</a></li>
            <li><a href="pavlova.html">Pavlova Cakes (RM88)</a></li>
            <li><a href="cheese-tarts.html">Cheese Tarts</a></li>
            <li><a href="fruit-tarts.html">Fruit Tarts</a></li>
            <li><a href="egg-tarts.html">Egg Tarts</a></li>
            <li><a href="traditional-indian.html">Indian Heritage Sweets</a></li>
            <li><a href="traditional-kuih.html">Malaysian Kuih</a></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4 class="footer-col-title">Get In Touch</h4>
          <p><i class="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:+60123360470">012-336 0470</a></p>
          <p><i class="fa-solid fa-envelope" aria-hidden="true"></i> <a href="mailto:kagsivasiva15@gmail.com">kagsivasiva15@gmail.com</a></p>
          <p><i class="fa-solid fa-clock" aria-hidden="true"></i> 9:00 AM – 9:00 PM Daily</p>
          <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Klang Valley, Selangor, Malaysia</p>
          <a href="https://wa.me/60123360470?text=Hello%20Veni%20Delights!%20I'd%20like%20to%20order."
             class="btn btn-primary btn-sm footer-wa-btn"
             target="_blank" rel="noopener noreferrer"
             aria-label="Order via WhatsApp">
            <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
            Order Now
          </a>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bottom">
    <div class="container">
      <p class="footer-copyright">© 2016 - 2026 Veni Delights. All Rights Reserved. | Klang, Selangor, Malaysia</p>
      <p class="footer-made">Freshly Homemade with ❤️ for every celebration</p>
    </div>
  </div>
</footer>

<a href="https://wa.me/60123360470?text=Hello%20Veni%20Delights!%20I'd%20like%20to%20place%20an%20order."
   class="floating-wa"
   target="_blank"
   rel="noopener noreferrer"
   aria-label="Chat on WhatsApp"
   title="Order via WhatsApp">
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.52 3.48A11.8 11.8 0 0 0 12.04 0C5.42 0 .04 5.38.04 12c0 2.12.55 4.19 1.6 6.02L0 24l6.17-1.61A11.9 11.9 0 0 0 12.04 24C18.66 24 24 18.62 24 12c0-3.2-1.25-6.21-3.48-8.52ZM12.04 21.83c-1.84 0-3.64-.49-5.22-1.43l-.37-.22-3.66.96.98-3.57-.24-.37A9.8 9.8 0 0 1 2.21 12c0-5.42 4.41-9.83 9.83-9.83 2.63 0 5.1 1.03 6.95 2.88A9.77 9.77 0 0 1 21.87 12c0 5.42-4.41 9.83-9.83 9.83Zm5.39-7.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.46-.51.15-.17.2-.29.3-.49.1-.2.05-.37-.02-.52-.07-.15-.66-1.59-.91-2.18-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.09 3.2 5.07 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.42-.08-.13-.27-.2-.57-.35Z"/>
  </svg>
  <span class="floating-wa-label">Order</span>
</a>

<script type="module" src="/src/js/main.js"></script>
  `;
}

// Master HTML Document Wrapper
function wrapHTML({ title, description, activePage, canonical, bodyContent }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://kagsivasiva15-dot.github.io/Veni-Delights-Website/${canonical}">

  <!-- Open Graph -->
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://kagsivasiva15-dot.github.io/Veni-Delights-Website/${canonical}">
  <meta property="og:image" content="https://kagsivasiva15-dot.github.io/Veni-Delights-Website/images/logo/logo.jpg">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="images/logo/favicon.svg">
  <link rel="icon" type="image/jpeg" href="images/logo/logo.jpg">

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="/src/css/design-system.css">
  <link rel="stylesheet" href="/src/css/main.css">
</head>
<body>
<a href="#main-content" class="skip-link">Skip to main content</a>

${renderNavbar(activePage)}

<main id="main-content">
${bodyContent}
</main>

${renderOrderDrawer()}
${renderFooter()}

</body>
</html>
`;
}

// -------------------------------------------------------------
// PAGE GENERATORS
// -------------------------------------------------------------

console.log('Generating all 19 independent HTML pages...');

// 1. ABOUT PAGE (about.html)
const aboutHTML = wrapHTML({
  title: 'Our Story & Artisan Heritage — Veni Delights Klang',
  description: 'Handcrafted with pure European butter, fresh pandan, and zero artificial preservatives. The story of Veni Delights since 2016 in Klang, Selangor.',
  activePage: 'about',
  canonical: 'about.html',
  bodyContent: `
    <!-- Page Hero -->
    <section class="category-hero" aria-label="About Veni Delights Heritage">
      <div class="container">
        <div class="category-hero-inner">
          <div>
            <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
              <span style="width:8px; height:8px; border-radius:50%; background:#25D366;"></span>
              EST. 2016 • KLANG, SELANGOR
            </span>
            <h1 class="hero-title" style="font-size:clamp(2.2rem, 4vw, 3.4rem); color:#FAF7F0; margin-bottom:1rem;">
              Crafted With Heart, <br><span class="hero-title-accent">Baked With Pure Butter.</span>
            </h1>
            <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7; margin-bottom:1.5rem;">
              What started as a kitchen passion for authentic homemade bakes has blossomed into Klang Valley's premier destination for celebratory cakes and bespoke dessert tables.
            </p>
            <div class="taste-notes-bar">
              <span class="taste-chip"><i class="fa-solid fa-cow"></i> 100% Pure Dairy Butter</span>
              <span class="taste-chip"><i class="fa-solid fa-leaf"></i> Fresh Natural Pandan</span>
              <span class="taste-chip"><i class="fa-solid fa-shield-halved"></i> 100% Halal Ingredients</span>
              <span class="taste-chip"><i class="fa-solid fa-truck-fast"></i> Daily Klang Fresh Dispatch</span>
            </div>
          </div>
          <div class="category-hero-image-wrap">
            <img src="images/about/about-1.png" alt="Veni Delights Kitchen & Heritage" loading="eager">
          </div>
        </div>
      </div>
    </section>

    <!-- Heritage Story Section -->
    <section class="section-pad bg-cream">
      <div class="container">
        <div class="section-header text-center" data-reveal>
          <span class="section-eyebrow">Our Philosophy</span>
          <h2 class="section-title">The Four Pillars of Pure Craftsmanship</h2>
          <p class="section-subtitle">Every recipe has been refined across thousands of celebrations to deliver uncompromising taste.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:24px; margin-top:2.5rem;">
          <div class="card card-dark" style="padding:28px; border-radius:18px; border:1px solid rgba(213,174,97,0.25);" data-reveal>
            <div style="font-size:2.2rem; color:var(--color-gold-champagne); margin-bottom:14px;"><i class="fa-solid fa-award"></i></div>
            <h3 style="color:#FAF7F0; margin-bottom:10px; font-family:var(--font-display);">100% Pure European Butter</h3>
            <p style="color:#B5AFA3; font-size:0.9rem; line-height:1.6;">We never substitute real butter with margarine, vegetable shortening, or palm oil blends. You taste authentic golden dairy in every single crumb.</p>
          </div>

          <div class="card card-dark" style="padding:28px; border-radius:18px; border:1px solid rgba(213,174,97,0.25);" data-reveal>
            <div style="font-size:2.2rem; color:var(--color-gold-champagne); margin-bottom:14px;"><i class="fa-solid fa-mortar-pestle"></i></div>
            <h3 style="color:#FAF7F0; margin-bottom:10px; font-family:var(--font-display);">Fresh Botanical Pandan</h3>
            <p style="color:#B5AFA3; font-size:0.9rem; line-height:1.6;">Our legendary Pandan Layer Cake uses fresh, hand-pounded pandan leaves extracted on the day of baking for an earthy, naturally aromatic sweetness.</p>
          </div>

          <div class="card card-dark" style="padding:28px; border-radius:18px; border:1px solid rgba(213,174,97,0.25);" data-reveal>
            <div style="font-size:2.2rem; color:var(--color-gold-champagne); margin-bottom:14px;"><i class="fa-solid fa-hand-holding-heart"></i></div>
            <h3 style="color:#FAF7F0; margin-bottom:10px; font-family:var(--font-display);">Zero Artificial Preservatives</h3>
            <p style="color:#B5AFA3; font-size:0.9rem; line-height:1.6;">Baked fresh to order for your specific event date. Clean label, wholesome ingredients, and small batches made with motherly love.</p>
          </div>

          <div class="card card-dark" style="padding:28px; border-radius:18px; border:1px solid rgba(213,174,97,0.25);" data-reveal>
            <div style="font-size:2.2rem; color:var(--color-gold-champagne); margin-bottom:14px;"><i class="fa-solid fa-star-and-crescent"></i></div>
            <h3 style="color:#FAF7F0; margin-bottom:10px; font-family:var(--font-display);">Muslim-Friendly Halal Standards</h3>
            <p style="color:#B5AFA3; font-size:0.9rem; line-height:1.6;">All ingredients, gelatines, and essences are strictly Halal-certified and alcohol-free, ensuring pure peace of mind for every celebration.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Master Baker Profile & Timeline -->
    <section class="section-pad bg-black">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center;">
          <div data-reveal="left">
            <span class="section-eyebrow">The Artisan Behind The Kitchen</span>
            <h2 class="section-title text-white">Veni & The Artisan Team</h2>
            <p style="color:#d5c5bc; line-height:1.8; margin-bottom:1.5rem;">
              "Baking is a conversation between patience and passion. When you fold pure butter into beaten sugar until it turns pale ivory, or watch a molten cheese tart bubble in the oven, you are giving a gift of joy to a family's table."
            </p>
            <p style="color:#B5AFA3; line-height:1.7; margin-bottom:2rem;">
              Serving over 5,000 satisfied clients across Klang, Shah Alam, Petaling Jaya, Subang, and Kuala Lumpur, Veni Delights continues to handcraft every single order individually.
            </p>
            <a href="https://wa.me/60123360470?text=Hi%20Veni,%20I'd%20like%20to%20discuss%20a%20celebration%20cake." class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
              <i class="fa-brands fa-whatsapp"></i> Speak With Veni
            </a>
          </div>

          <div class="card card-dark" style="padding:32px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);" data-reveal="right">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem; font-size:1.5rem;">Milestones of Excellence</h3>
            <div style="border-left:2px solid var(--color-gold-champagne); padding-left:20px; display:flex; flex-direction:column; gap:20px;">
              <div>
                <span style="color:var(--color-gold-champagne); font-weight:700; font-size:0.9rem;">2016 — Humble Home Oven</span>
                <p style="color:#B5AFA3; font-size:0.85rem; margin-top:4px;">First Pure Butter Cakes baked for family friends and local school celebrations in Klang.</p>
              </div>
              <div>
                <span style="color:var(--color-gold-champagne); font-weight:700; font-size:0.9rem;">2019 — Signature Pandan Layer</span>
                <p style="color:#B5AFA3; font-size:0.85rem; margin-top:4px;">Perfected the 5-layer natural agar-agar and chiffon recipe, quickly becoming a Klang Valley icon.</p>
              </div>
              <div>
                <span style="color:var(--color-gold-champagne); font-weight:700; font-size:0.9rem;">2021 — Luxury Dessert Corner Launch</span>
                <p style="color:#B5AFA3; font-size:0.85rem; margin-top:4px;">Expanded to complete on-site wedding, corporate, and birthday dessert styling packages.</p>
              </div>
              <div>
                <span style="color:var(--color-gold-champagne); font-weight:700; font-size:0.9rem;">2026 — World-Class Digital Bakery</span>
                <p style="color:#B5AFA3; font-size:0.85rem; margin-top:4px;">3D interactive cake studio, AI concierge, procedural cinema, and direct WhatsApp commerce.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'about.html'), aboutHTML, 'utf-8');

// 2. MASTER PRODUCTS PAGE (products.html)
const allProductCards = PRODUCTS.map(cat => `
  <div class="product-category-group" id="group-${cat.id}" style="margin-bottom:3.5rem;">
    <div style="display:flex; justify-content:space-between; align-items:flex-end; border-bottom:1px solid rgba(213,174,97,0.3); padding-bottom:12px; margin-bottom:24px;">
      <div>
        <span style="color:var(--color-primary); font-size:0.8rem; font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">${cat.category}</span>
        <h3 style="font-family:var(--font-display); font-size:1.8rem; color:var(--color-dark); margin:4px 0 0 0;">${cat.category}</h3>
      </div>
      <span style="color:var(--color-primary); font-weight:600; font-size:0.95rem;">${cat.categoryPrice || cat.categoryNote || ''}</span>
    </div>
    <div class="product-grid">
      ${cat.items.map(renderProductCard).join('\n')}
    </div>
  </div>
`).join('\n');

const productsHTML = wrapHTML({
  title: 'Artisan Menu & Signature Collection — Veni Delights',
  description: 'Explore all 9 handcrafted dessert collections by Veni Delights. Pure Butter Cakes (RM79), Fudge Brownies (RM59), Pandan Layer, Pavlovas, and Artisan Tarts.',
  activePage: 'products',
  canonical: 'products.html',
  bodyContent: `
    <section class="category-hero" aria-label="Products Catalog Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          ALL 9 ARTISAN CATEGORIES • FRESHLY HOMEMADE
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Our Signature <span class="hero-title-accent">Patisserie Menu</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          From golden 100% butter cakes to jewel-like fresh fruit tarts and decadent dessert tables. Add items directly to your order builder or chat on WhatsApp.
        </p>
      </div>
    </section>

    <!-- Quick Filter Links -->
    <div class="filter-strip" style="background:#140C0B; padding:16px 0; border-bottom:1px solid rgba(213,174,97,0.25); position:sticky; top:var(--navbar-height); z-index:40;">
      <div class="container" style="display:flex; gap:10px; overflow-x:auto; padding-bottom:6px;">
        <a href="#group-butter-series" class="btn btn-sm btn-cream" style="white-space:nowrap;">Butter Series (RM79)</a>
        <a href="#group-brownies" class="btn btn-sm btn-cream" style="white-space:nowrap;">Brownies (RM59)</a>
        <a href="#group-pandan-layer" class="btn btn-sm btn-cream" style="white-space:nowrap;">Pandan Layer</a>
        <a href="#group-pavlova" class="btn btn-sm btn-cream" style="white-space:nowrap;">Pavlova (RM88)</a>
        <a href="#group-cheese-tart" class="btn btn-sm btn-cream" style="white-space:nowrap;">Cheese Tarts</a>
        <a href="#group-fruit-tart" class="btn btn-sm btn-cream" style="white-space:nowrap;">Fruit Tarts</a>
        <a href="#group-egg-tart" class="btn btn-sm btn-cream" style="white-space:nowrap;">Egg Tarts</a>
        <a href="#group-traditional-indian" class="btn btn-sm btn-cream" style="white-space:nowrap;">Heritage Sweets</a>
        <a href="#group-traditional-kuih" class="btn btn-sm btn-cream" style="white-space:nowrap;">Traditional Kuih</a>
      </div>
    </div>

    <section class="section-pad bg-white">
      <div class="container">
        ${allProductCards}
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'products.html'), productsHTML, 'utf-8');

// Helper for category detail pages
function buildCategoryPage({ slug, title, subtitle, badge, image, catId, tasteNotes = [], detailsHTML = '', canonical }) {
  const cat = PRODUCTS.find(c => c.id === catId);
  const items = cat ? cat.items : [];

  return wrapHTML({
    title: `${title} — Veni Delights Klang`,
    description: subtitle,
    activePage: slug,
    canonical: canonical,
    bodyContent: `
      <section class="category-hero" aria-label="${title} Hero">
        <div class="container">
          <div class="category-hero-inner">
            <div>
              <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
                ${badge}
              </span>
              <h1 class="hero-title" style="font-size:clamp(2.2rem, 4vw, 3.4rem); color:#FAF7F0; margin-bottom:1rem;">
                ${title}
              </h1>
              <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7; margin-bottom:1.5rem;">
                ${subtitle}
              </p>
              ${tasteNotes.length > 0 ? `
                <div class="taste-notes-bar">
                  ${tasteNotes.map(n => `<span class="taste-chip">${n}</span>`).join('\n')}
                </div>
              ` : ''}
              <div style="margin-top:24px; display:flex; gap:12px; flex-wrap:wrap;">
                <a href="#category-items" class="btn btn-primary btn-lg">
                  <i class="fa-solid fa-utensils"></i> View Selection
                </a>
                <a href="https://wa.me/60123360470?text=Hi%20Veni%20Delights!%20I'm%20interested%20in%20${encodeURIComponent(title)}" class="btn btn-cream btn-lg" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-whatsapp"></i> Quick Enquiry
                </a>
              </div>
            </div>
            <div class="category-hero-image-wrap">
              <img src="${image}" alt="${title}" loading="eager">
            </div>
          </div>
        </div>
      </section>

      ${detailsHTML}

      <section class="section-pad bg-white" id="category-items">
        <div class="container">
          <div class="section-header text-center" data-reveal>
            <span class="section-eyebrow">Available Creations</span>
            <h2 class="section-title">Handcrafted Fresh Daily</h2>
            <p class="section-subtitle">Select your favourite and add directly to your order builder.</p>
          </div>
          <div class="product-grid" style="margin-top:2.5rem;">
            ${items.map(renderProductCard).join('\n')}
          </div>
        </div>
      </section>
    `
  });
}

// 3. BUTTER CAKES PAGE (butter-cakes.html)
const butterCakesHTML = buildCategoryPage({
  slug: 'butter-cakes',
  catId: 'butter-series',
  canonical: 'butter-cakes.html',
  badge: 'SIGNATURE COLLECTION • ALL RM79',
  title: '100% Pure European Butter Cakes',
  subtitle: 'Rich golden aroma, soft moist velvet crumb, and slow-creamed pure dairy butter. Baked fresh daily in Klang at RM79.',
  image: 'images/product/butter series/pure butter.png',
  tasteNotes: [
    '<i class="fa-solid fa-cow"></i> Butteriness 98%',
    '<i class="fa-solid fa-droplet"></i> Moisture 94%',
    '<i class="fa-solid fa-fire-burner"></i> Slow Churned',
    '<i class="fa-solid fa-cube"></i> Pure Dairy'
  ],
  detailsHTML: `
    <section class="section-pad bg-cream">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:center;">
          <div>
            <span class="section-eyebrow">The Secret of Real Butter</span>
            <h2 class="section-title">Why Pure Dairy Makes All The Difference</h2>
            <p style="color:#666; line-height:1.7; margin-bottom:1rem;">
              Commercial cakes often rely on vegetable shortening or butter substitutes to reduce cost. At Veni Delights, our Butter Series is founded upon 100% real dairy butter.
            </p>
            <p style="color:#666; line-height:1.7; margin-bottom:1.5rem;">
              The butter is creamed slowly for 25 minutes with organic caster sugar until airy and feather-light, then baked at low temperature to preserve the delicate milk solids and deep golden crust.
            </p>
            <div style="background:#FFFFFF; padding:18px; border-radius:12px; border-left:4px solid var(--color-primary); box-shadow:0 4px 15px rgba(0,0,0,0.05);">
              <strong style="color:var(--color-primary); display:block; margin-bottom:4px;">Chef's Storage Recommendation:</strong>
              <p style="margin:0; font-size:0.88rem; color:#555;">Keeps soft at room temperature for up to 3 days in an airtight container. Refrigerate up to 7 days; bring to room temperature 30 minutes before serving for maximum butter aroma.</p>
            </div>
          </div>
          <div class="card card-dark" style="padding:30px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.2rem;">Flavour Lineup (All RM79)</h3>
            <ul style="color:#B5AFA3; display:flex; flex-direction:column; gap:12px; font-size:0.92rem;">
              <li><strong style="color:#FAF7F0;">Pure Butter Cake:</strong> Timeless, velvety, and deeply aromatic.</li>
              <li><strong style="color:#FAF7F0;">Orange Butter Cake:</strong> Infused with fresh orange zest and fresh juice.</li>
              <li><strong style="color:#FAF7F0;">Butter Marble Cake:</strong> Contrast swirls of dark cocoa and rich butter.</li>
              <li><strong style="color:#FAF7F0;">Red Velvet Butter Cake:</strong> Rich cocoa undertones with ruby velvet crumb.</li>
              <li><strong style="color:#FAF7F0;">Pandan Butter Cake:</strong> Fragrant Southeast Asian pandan infusion.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'butter-cakes.html'), butterCakesHTML, 'utf-8');

// 4. BROWNIES PAGE (brownies.html)
const browniesHTML = buildCategoryPage({
  slug: 'brownies',
  catId: 'brownies',
  canonical: 'brownies.html',
  badge: '72% DARK COCOA INDULGENCE',
  title: 'Fudge Brownies & Celebration Towers',
  subtitle: 'Crinkly shiny tops, dense fudgy centers, and intense Belgian dark cocoa. Standard trays at RM59 and towering celebration towers at RM100.',
  image: 'images/product/brownies/brownies 1.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-cookie-bite"></i> Fudginess 96%',
    '<i class="fa-solid fa-mug-hot"></i> 72% Dark Cocoa',
    '<i class="fa-solid fa-sparkles"></i> Shiny Crinkle Top',
    '<i class="fa-solid fa-tower-observation"></i> Tower Options'
  ],
  detailsHTML: `
    <section class="section-pad bg-cream">
      <div class="container text-center" style="max-width:800px; margin:0 auto;">
        <span class="section-eyebrow">Celebration Centerpiece</span>
        <h2 class="section-title">The Signature Brownie Tower (RM100)</h2>
        <p style="color:#666; line-height:1.7; margin-bottom:2rem;">
          Looking for a modern alternative to traditional tiered cakes? Our signature Brownie Tower stacks dozens of bite-sized fudge brownie cubes, layered with fresh strawberries, drizzled chocolate ganache, and edible gold flakes.
        </p>
        <a href="https://wa.me/60123360470?text=Hi%20Veni%20Delights!%20I'd%20like%20to%20order%20the%20Brownie%20Tower%20(RM100)." class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp"></i> Order Brownie Tower (RM100)
        </a>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'brownies.html'), browniesHTML, 'utf-8');

// 5. PANDAN LAYER CAKE (pandan-layer.html)
const pandanLayerHTML = buildCategoryPage({
  slug: 'pandan-layer',
  catId: 'pandan-layer',
  canonical: 'pandan-layer.html',
  badge: 'KLANG VALLEY LEGEND • RM69 / RM89',
  title: 'Authentic 5-Layer Pandan Heritage Cake',
  subtitle: 'Five alternating layers of fragrant pandan coconut agar-agar and cloud-soft pandan chiffon sponge. 8 Inch (RM69) & 10 Inch (RM89).',
  image: 'images/product/pandan layer/pandan layer.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-leaf"></i> Fresh Pandan Suji',
    '<i class="fa-solid fa-seedling"></i> Thick Coconut Santan',
    '<i class="fa-solid fa-layer-group"></i> 5 Precision Layers',
    '<i class="fa-solid fa-snowflake"></i> Chilled Refreshment'
  ],
  detailsHTML: `
    <section class="section-pad bg-black">
      <div class="container">
        <div class="section-header text-center" data-reveal>
          <span class="section-eyebrow" style="color:var(--color-gold-champagne);">Culinary Architecture</span>
          <h2 class="section-title text-white">Anatomy of The Authentic 5-Layer Cake</h2>
          <p class="section-subtitle" style="color:#d5c5bc;">Poured by hand in small batches with strict timing between each setting tier.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-top:2.5rem;">
          <div class="card card-dark" style="padding:24px; border-radius:16px; border:1px solid rgba(213,174,97,0.3); text-align:center;">
            <span style="color:var(--color-gold-champagne); font-weight:700; font-size:1.1rem; display:block; margin-bottom:8px;">Tier 1</span>
            <h4 style="color:#FAF7F0; margin-bottom:8px;">Pandan Mirror Glaze</h4>
            <p style="color:#B5AFA3; font-size:0.85rem; margin:0;">Translucent agar-agar infused with cold-pressed pandan leaf juice.</p>
          </div>
          <div class="card card-dark" style="padding:24px; border-radius:16px; border:1px solid rgba(213,174,97,0.3); text-align:center;">
            <span style="color:var(--color-gold-champagne); font-weight:700; font-size:1.1rem; display:block; margin-bottom:8px;">Tier 2</span>
            <h4 style="color:#FAF7F0; margin-bottom:8px;">Feather Chiffon</h4>
            <p style="color:#B5AFA3; font-size:0.85rem; margin:0;">Ultra-soft green chiffon sponge baked with natural pandan essence.</p>
          </div>
          <div class="card card-dark" style="padding:24px; border-radius:16px; border:1px solid rgba(213,174,97,0.3); text-align:center;">
            <span style="color:var(--color-gold-champagne); font-weight:700; font-size:1.1rem; display:block; margin-bottom:8px;">Tier 3</span>
            <h4 style="color:#FAF7F0; margin-bottom:8px;">Santan Kaya Custard</h4>
            <p style="color:#B5AFA3; font-size:0.85rem; margin:0;">Creamy coconut milk jelly with subtle sweetness and cooling texture.</p>
          </div>
          <div class="card card-dark" style="padding:24px; border-radius:16px; border:1px solid rgba(213,174,97,0.3); text-align:center;">
            <span style="color:var(--color-gold-champagne); font-weight:700; font-size:1.1rem; display:block; margin-bottom:8px;">Tier 4</span>
            <h4 style="color:#FAF7F0; margin-bottom:8px;">Second Chiffon</h4>
            <p style="color:#B5AFA3; font-size:0.85rem; margin:0;">Moist sponge core that absorbs the chilled aroma of the coconut layers.</p>
          </div>
          <div class="card card-dark" style="padding:24px; border-radius:16px; border:1px solid rgba(213,174,97,0.3); text-align:center;">
            <span style="color:var(--color-gold-champagne); font-weight:700; font-size:1.1rem; display:block; margin-bottom:8px;">Tier 5</span>
            <h4 style="color:#FAF7F0; margin-bottom:8px;">Pandan Foundation</h4>
            <p style="color:#B5AFA3; font-size:0.85rem; margin:0;">Firm, aromatic pandan jelly base that provides crisp structural stability.</p>
          </div>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'pandan-layer.html'), pandanLayerHTML, 'utf-8');

// 6. PAVLOVA PAGE (pavlova.html)
const pavlovaHTML = buildCategoryPage({
  slug: 'pavlova',
  catId: 'pavlova',
  canonical: 'pavlova.html',
  badge: 'FEATHER-LIGHT CLOUD • ALL RM88',
  title: 'Pavlova Pudding Cake Collection',
  subtitle: 'Crisp gossamer meringue exterior yielding to a pillowy marshmallow heart, crowned with fresh Chantilly cream and succulent fruit. All 5 varieties at RM88.',
  image: 'images/product/pavlova/strawberry pavlova.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-cloud"></i> Crisp Meringue Shell',
    '<i class="fa-solid fa-ice-cream"></i> Marshmallow Center',
    '<i class="fa-solid fa-bowl-food"></i> Fresh Chantilly Cream',
    '<i class="fa-solid fa-tags"></i> Fixed RM88 Pricing'
  ]
});
fs.writeFileSync(path.join(rootDir, 'pavlova.html'), pavlovaHTML, 'utf-8');

// 7. FRUIT TARTS PAGE (fruit-tarts.html)
const fruitTartsHTML = buildCategoryPage({
  slug: 'fruit-tarts',
  catId: 'fruit-tart',
  canonical: 'fruit-tarts.html',
  badge: 'HAND-PIPED SABLE CRUST • MIN 10 PCS',
  title: 'Artisan Fresh Fruit Tarts',
  subtitle: 'Buttery French sablé pastry cases piped with silky vanilla diplomat cream and hand-topped with fresh strawberries, blueberries, kiwi, and grapes.',
  image: 'images/product/fruit tart/fruit tart.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-cookie"></i> French Sablé Crust',
    '<i class="fa-solid fa-lemon"></i> Madagascar Vanilla Cream',
    '<i class="fa-solid fa-apple-whole"></i> Fresh Seasonal Berries',
    '<i class="fa-solid fa-tag"></i> RM3.00 (10-30 pcs) / RM2.80 (31+ pcs)'
  ]
});
fs.writeFileSync(path.join(rootDir, 'fruit-tarts.html'), fruitTartsHTML, 'utf-8');

// 8. EGG TARTS PAGE (egg-tarts.html)
const eggTartsHTML = buildCategoryPage({
  slug: 'egg-tarts',
  catId: 'egg-tart',
  canonical: 'egg-tarts.html',
  badge: 'FLAKY GOLDEN LAYERS • MIN 10 PCS',
  title: 'Portuguese & Classic Egg Tarts',
  subtitle: 'Hand-laminated caramelized Portuguese puff pastry and traditional silky Hong Kong-style egg tarts with tender shortcrust. Freshly baked each morning.',
  image: 'images/product/egg tart/portuguese egg tart.png',
  tasteNotes: [
    '<i class="fa-solid fa-fire"></i> Caramelized Brulee Blisters',
    '<i class="fa-solid fa-layer-group"></i> 64 Laminated Layers',
    '<i class="fa-solid fa-egg"></i> Silky Smooth Custard',
    '<i class="fa-solid fa-tag"></i> RM2.80 (10-30 pcs) / RM2.50 (31+ pcs)'
  ]
});
fs.writeFileSync(path.join(rootDir, 'egg-tarts.html'), eggTartsHTML, 'utf-8');

// 9. CHEESE TARTS PAGE (cheese-tarts.html)
const cheeseTartsHTML = buildCategoryPage({
  slug: 'cheese-tarts',
  catId: 'cheese-tart',
  canonical: 'cheese-tarts.html',
  badge: 'MOLTEN CREAM CHEESE • FROM RM2.00',
  title: 'Artisan Molten Cheese Tarts',
  subtitle: 'Double-baked buttery shells overflowing with molten lava cream cheese and luscious fruit compotes. Blueberry, Strawberry, Kiwi, and Nutella.',
  image: 'images/product/cheese tart/blueberry.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-cheese"></i> Molten Lava Center',
    '<i class="fa-solid fa-cookie-bite"></i> Double Buttered Shell',
    '<i class="fa-solid fa-boxes-stacked"></i> Bulk Rate: RM2.00 (101+ pcs)',
    '<i class="fa-solid fa-tag"></i> Standard: RM2.50 (10-100 pcs)'
  ]
});
fs.writeFileSync(path.join(rootDir, 'cheese-tarts.html'), cheeseTartsHTML, 'utf-8');

// 10. TRADITIONAL INDIAN SWEETS (traditional-indian.html)
const traditionalIndianHTML = buildCategoryPage({
  slug: 'traditional-indian',
  catId: 'traditional-indian',
  canonical: 'traditional-indian.html',
  badge: 'TIME-HONOURED HERITAGE RECIPES',
  title: 'Traditional Indian Celebration Sweets',
  subtitle: 'Authentic Indian delicacies prepared for Deepavali, family poojas, housewarmings, and weddings. Adhirasam, Pure Ghee Kesari, and Steamed Modagam.',
  image: 'images/product/traditional/kesari.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-spoon"></i> Pure Ghee Preparation',
    '<i class="fa-solid fa-pepper-hot"></i> Cardamom & Saffron Infusion',
    '<i class="fa-solid fa-hands-praying"></i> Temple & Prayer Grade',
    '<i class="fa-solid fa-phone"></i> Custom Quantity Quotation'
  ]
});
fs.writeFileSync(path.join(rootDir, 'traditional-indian.html'), traditionalIndianHTML, 'utf-8');

// 11. TRADITIONAL MALAYSIAN KUIH (traditional-kuih.html)
const traditionalKuihHTML = buildCategoryPage({
  slug: 'traditional-kuih',
  catId: 'traditional-kuih',
  canonical: 'traditional-kuih.html',
  badge: 'KAMPUNG RECIPES • FRESH SANTAN',
  title: 'Malaysian Heritage Kuih Muih',
  subtitle: 'Handmade daily using fresh thick coconut santan, pure pandan extract, and aromatic gula Melaka. Karipap, Kaswi, Ketayap, Kuih Lapis, Seri Muka, and Wajik.',
  image: 'images/product/traditional/karipap.jpg',
  tasteNotes: [
    '<i class="fa-solid fa-leaf"></i> 100% Fresh Santan & Pandan',
    '<i class="fa-solid fa-cube"></i> Pure Gula Melaka',
    '<i class="fa-solid fa-sun"></i> Steamed Fresh Daily',
    '<i class="fa-solid fa-phone"></i> Event Platter Enquiries'
  ]
});
fs.writeFileSync(path.join(rootDir, 'traditional-kuih.html'), traditionalKuihHTML, 'utf-8');

// 12. DESSERT CORNER PAGE (dessert-corner.html)
const packagesHTML = DESSERT_CORNER.packages.map(pkg => {
  const items = pkg.items || [];
  return `
  <article class="package-card" style="background:#140C0B; border:1px solid rgba(213,174,97,0.35); border-radius:20px; padding:32px; display:flex; flex-direction:column; justify-content:space-between; position:relative; overflow:hidden;" data-reveal>
    ${pkg.recommended ? `<span style="position:absolute; top:16px; right:16px; background:linear-gradient(135deg, #A92D42 0%, #D5AE61 100%); color:#FFF; font-size:0.7rem; font-weight:700; text-transform:uppercase; padding:4px 12px; border-radius:99px;">MOST POPULAR</span>` : ''}
    <div>
      <span style="color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; text-transform:uppercase; letter-spacing:0.1em;">Curated Event Suite</span>
      <h3 style="font-family:var(--font-display); color:#FAF7F0; font-size:1.8rem; margin:8px 0;">${pkg.name}</h3>
      <div style="font-size:2.2rem; font-weight:700; color:var(--color-gold-champagne); margin-bottom:12px;">RM${pkg.price}</div>
      <p style="color:#B5AFA3; font-size:0.88rem; line-height:1.6; margin-bottom:18px;">Complete table setup with tiered display stands, decor styling, and fresh bakes.</p>
      
      <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:16px; margin-bottom:20px;">
        <strong style="color:#FAF7F0; font-size:0.85rem; display:block; margin-bottom:8px;">Included in this setup:</strong>
        <ul style="color:#B5AFA3; font-size:0.85rem; display:flex; flex-direction:column; gap:6px; padding-left:18px;">
          ${items.map(f => `<li>${f}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div>
      <button class="btn btn-primary btn-full pkg-select-btn" data-pkg-id="${pkg.id}" style="margin-bottom:8px;">
        <i class="fa-solid fa-calculator"></i> Select & Calculate
      </button>
      <a href="https://wa.me/60123360470?text=Hi%20Veni%20Delights!%20I'm%20interested%20in%20the%20${encodeURIComponent(pkg.name)}%20(RM${pkg.price})." class="btn btn-cream btn-full btn-sm" target="_blank" rel="noopener noreferrer">
        <i class="fa-brands fa-whatsapp"></i> Quick WhatsApp Enquiry
      </a>
    </div>
  </article>
  `;
}).join('\n');

const addonsHTML = DESSERT_CORNER.addOns.map(addon => `
  <div class="addon-card" data-addon-id="${addon.id}" style="background:#FFFFFF; border:1px solid rgba(0,0,0,0.08); border-radius:14px; padding:20px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; transition:all 0.25s ease;">
    <div style="display:flex; align-items:center; gap:12px;">
      <span style="font-size:1.6rem;">${addon.icon || '✨'}</span>
      <div>
        <h4 style="margin:0 0 4px 0; color:var(--color-dark); font-size:1rem;">${addon.name}</h4>
        <p style="margin:0; font-size:0.82rem; color:#666;">Optional Celebration Add-On</p>
      </div>
    </div>
    <div style="font-weight:700; color:var(--color-primary); font-size:1.1rem; white-space:nowrap; margin-left:16px;">
      +RM${addon.price}
    </div>
  </div>
`).join('\n');

const dessertCornerHTML = wrapHTML({
  title: 'Luxury Dessert Corner & Event Catering — Veni Delights',
  description: 'Bespoke dessert table setups for weddings, birthdays, baby showers, and corporate galas in Klang Valley. Budget (RM200), Package A (RM350), B (RM550), C (RM750).',
  activePage: 'dessert-corner',
  canonical: 'dessert-corner.html',
  bodyContent: `
    <section class="category-hero" aria-label="Dessert Corner Catering Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          <i class="fa-solid fa-calendar-check"></i> MINIMUM 1 MONTH ADVANCE NOTICE REQUIRED
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Luxury <span class="hero-title-accent">Dessert Corner</span> Catering
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Elevate your wedding, birthday, or corporate celebration with our custom on-site dessert tables. Complete with themed decor, elegant tier stands, and artisanal bakes.
        </p>
      </div>
    </section>

    <!-- Packages Grid -->
    <section class="section-pad bg-black">
      <div class="container">
        <div class="section-header text-center" data-reveal>
          <span class="section-eyebrow" style="color:var(--color-gold-champagne);">Curated Celebration Suites</span>
          <h2 class="section-title text-white">Choose Your Event Package</h2>
          <p class="section-subtitle" style="color:#d5c5bc;">All packages include table setup, elegant tiered display stands, and handcrafted desserts.</p>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(270px, 1fr)); gap:24px; margin-top:3rem;" id="dessert-packages-grid">
          ${packagesHTML}
        </div>
      </div>
    </section>

    <!-- Interactive Event Quotation Calculator -->
    <section class="section-pad bg-cream" id="calculator">
      <div class="container">
        <div class="section-header text-center" data-reveal>
          <span class="section-eyebrow">Instant Quotation</span>
          <h2 class="section-title">Customise Your Setup & Add-Ons</h2>
          <p class="section-subtitle">Select your base package and optional enhancements to build your customized celebration quote.</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; margin-top:2.5rem;">
          <div>
            <h3 style="font-family:var(--font-display); margin-bottom:1.2rem; color:var(--color-dark);">Optional Premium Add-Ons</h3>
            <div style="display:flex; flex-direction:column; gap:12px;" id="addons-grid">
              ${addonsHTML}
            </div>
          </div>

          <div class="card card-dark event-enquiry-wrap" style="padding:32px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem;">Event Details & Quote</h3>
            
            <div class="form-group" style="margin-bottom:16px;">
              <label for="enquiry-package" class="form-label" style="color:#FAF7F0;">Selected Package</label>
              <select id="enquiry-package" class="form-select">
                <option value="">Select a package...</option>
                <option value="budget">Budget Package — RM200 (15-20 pax)</option>
                <option value="pkg-a">Package A — RM350 (30-40 pax)</option>
                <option value="pkg-b">Package B — RM550 (50-70 pax)</option>
                <option value="pkg-c">Package C — RM750 (80-120+ pax)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
              <div class="form-group">
                <label for="enquiry-event-type" class="form-label" style="color:#FAF7F0;">Event Type</label>
                <select id="enquiry-event-type" class="form-select">
                  <option value="">Select type...</option>
                  <option>Birthday Party</option>
                  <option>Wedding Reception</option>
                  <option>Baby Shower / Full Moon</option>
                  <option>Corporate Gala</option>
                  <option>Anniversary</option>
                </select>
              </div>
              <div class="form-group">
                <label for="enquiry-date" class="form-label" style="color:#FAF7F0;">Event Date (Min 1 Month)</label>
                <input type="date" id="enquiry-date" class="form-input">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
              <div class="form-group">
                <label for="enquiry-guests" class="form-label" style="color:#FAF7F0;">Estimated Guests</label>
                <select id="enquiry-guests" class="form-select">
                  <option value="">Select guest count...</option>
                  <option>15–20 guests</option>
                  <option>30–40 guests</option>
                  <option>50–70 guests</option>
                  <option>80–120+ guests</option>
                </select>
              </div>
              <div class="form-group">
                <label for="enquiry-location" class="form-label" style="color:#FAF7F0;">Event Venue / Area</label>
                <input type="text" id="enquiry-location" class="form-input" placeholder="e.g. Klang, Shah Alam, PJ">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:16px;">
              <label for="enquiry-name" class="form-label" style="color:#FAF7F0;">Your Name</label>
              <input type="text" id="enquiry-name" class="form-input" placeholder="Your name">
            </div>

            <div class="form-group" style="margin-bottom:20px;">
              <label for="enquiry-requirements" class="form-label" style="color:#FAF7F0;">Theme & Special Requests</label>
              <textarea id="enquiry-requirements" class="form-textarea" rows="2" placeholder="Colour palette (e.g. Strawberry Red & Gold), custom dessert requests..."></textarea>
            </div>

            <div id="enquiry-summary" style="background:rgba(255,255,255,0.08); padding:16px; border-radius:12px; margin-bottom:20px; color:#FAF7F0;">
              <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                <span>Estimated Setup Total:</span>
                <strong id="enquiry-total-price" style="color:var(--color-gold-champagne); font-size:1.3rem;">RM0</strong>
              </div>
              <p style="margin:0; font-size:0.78rem; color:#B5AFA3;">Final confirmation and slot availability are confirmed via WhatsApp.</p>
            </div>

            <button class="btn btn-whatsapp btn-full btn-lg" id="enquiry-submit-btn">
              <i class="fa-brands fa-whatsapp"></i> Send Event Enquiry on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'dessert-corner.html'), dessertCornerHTML, 'utf-8');

// 13. CAKE CUSTOMISE STUDIO (customise.html)
const customiseHTML = wrapHTML({
  title: 'Interactive Cake Customisation Studio — Veni Delights',
  description: 'Design your custom celebration cake in real time. Choose cake base, size, luxury frosting palette, toppings, and preview your live cursive inscription calligraphy.',
  activePage: 'customise',
  canonical: 'customise.html',
  bodyContent: `
    <section class="category-hero" aria-label="Cake Customisation Studio Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          INTERACTIVE DESIGN STUDIO • 5 DAYS NOTICE
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Design Your <span class="hero-title-accent">Bespoke Cake</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Watch your custom cake come to life on our interactive canvas. Customise sponge, palette, toppings, and calligraphy greeting, then submit your design directly to Veni.
        </p>
      </div>
    </section>

    <section class="section-pad bg-black">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:flex-start;">
          
          <!-- Interactive Preview Card -->
          <div class="card card-dark" style="padding:28px; border-radius:20px; border:1px solid rgba(213,174,97,0.35); text-align:center; position:sticky; top:calc(var(--navbar-height) + 20px);">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:16px;">Live Cake Visualiser</h3>
            <div class="preview-img-wrap" style="border-radius:16px; overflow:hidden; background:#0E0708; border:1px solid rgba(213,174,97,0.2); position:relative; min-height:320px; display:flex; align-items:center; justify-content:center;">
              <img id="customise-preview-img" src="images/product/butter series/pure butter.png" alt="Cake Preview" style="max-width:100%; height:280px; object-fit:contain;">
            </div>

            <div style="margin-top:18px; text-align:left;">
              <h4 id="preview-name" style="color:var(--color-gold-champagne); font-family:var(--font-display); font-size:1.3rem; margin:0 0 6px 0;">Pure Butter Cake</h4>
              <div id="preview-tags" style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">
                <span class="badge badge-gold">100% Pure Butter</span>
              </div>
              <div id="preview-fields" style="font-size:0.85rem; color:#B5AFA3; line-height:1.6;">
                Customise options below to see your creation update in real time.
              </div>
            </div>
          </div>

          <!-- Studio Controls Form -->
          <div class="card card-dark" style="padding:32px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem;">Customisation Options</h3>

            <div class="form-group" style="margin-bottom:16px;">
              <label for="custom-product" class="form-label" style="color:#FAF7F0;">1. Cake Foundation</label>
              <select id="custom-product" class="form-select">
                <option value="pure-butter-cake" selected>Pure Butter Cake (RM79)</option>
                <option value="orange-butter-cake">Orange Butter Cake (RM79)</option>
                <option value="butter-marble-cake">Butter Marble Cake (RM79)</option>
                <option value="red-velvet-butter-cake">Red Velvet Butter Cake (RM79)</option>
                <option value="pandan-butter-cake">Pandan Butter Cake (RM79)</option>
                <option value="brownies">Fudge Brownie Base (RM59)</option>
                <option value="pandan-layer-8">Pandan Layer Cake 8" (RM69)</option>
                <option value="pandan-layer-10">Pandan Layer Cake 10" (RM89)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
              <div class="form-group">
                <label for="custom-occasion" class="form-label" style="color:#FAF7F0;">2. Occasion</label>
                <select id="custom-occasion" class="form-select">
                  <option value="Birthday" selected>Birthday Celebration</option>
                  <option value="Wedding">Wedding / Engagement</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Baby Shower">Baby Shower / Full Moon</option>
                  <option value="Corporate">Corporate Gathering</option>
                </select>
              </div>

              <div class="form-group">
                <label for="custom-qty" class="form-label" style="color:#FAF7F0;">3. Quantity</label>
                <input type="number" id="custom-qty" class="form-input" min="1" max="20" value="1">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:16px;">
              <label for="custom-colour" class="form-label" style="color:#FAF7F0;">4. Frosting Theme / Colour Palette</label>
              <input type="text" id="custom-colour" class="form-input" placeholder="e.g. Strawberry Red & Cream, Gold Accents, Pastel Pink">
            </div>

            <div class="form-group" style="margin-bottom:16px;">
              <label for="custom-message" class="form-label" style="color:#FAF7F0;">5. Cursive Cake Inscription (Calligraphy)</label>
              <input type="text" id="custom-message" class="form-input" placeholder="e.g. Happy 30th Birthday Priya!" maxlength="50">
              <span style="font-size:0.75rem; color:#B5AFA3; margin-top:4px; display:block;">Piped in delicate edible royal icing across the cake top.</span>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px;">
              <div class="form-group">
                <label for="custom-name" class="form-label" style="color:#FAF7F0;">Your Name</label>
                <input type="text" id="custom-name" class="form-input" placeholder="Your name">
              </div>
              <div class="form-group">
                <label for="custom-date" class="form-label" style="color:#FAF7F0;">Collection / Delivery Date</label>
                <input type="date" id="custom-date" class="form-input">
              </div>
            </div>

            <div class="form-group" style="margin-bottom:20px;">
              <label for="custom-special" class="form-label" style="color:#FAF7F0;">Special Requests & Dietary Notes</label>
              <textarea id="custom-special" class="form-textarea" rows="2" placeholder="e.g. Extra gold leaf, fruit on the side, reduced sweetness..."></textarea>
            </div>

            <button class="btn btn-whatsapp btn-full btn-lg" id="customise-wa-btn">
              <i class="fa-brands fa-whatsapp"></i> Send Custom Cake Design via WhatsApp
            </button>
            <p style="font-size:0.78rem; color:#B5AFA3; text-align:center; margin-top:10px;">
              <i class="fa-solid fa-clock"></i> Minimum 5 days notice required for custom bakes.
            </p>
          </div>

        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'customise.html'), customiseHTML, 'utf-8');

// 14. VIRTUAL CONCIERGE (concierge.html)
const conciergeHTML = wrapHTML({
  title: 'Veni Virtual Concierge — Personal Dessert Pairing',
  description: 'Chat with Chef Veni for intelligent dessert recommendations. Tailored to your celebration occasion, guest count, flavour preference, and budget.',
  activePage: 'concierge',
  canonical: 'concierge.html',
  bodyContent: `
    <section class="category-hero" aria-label="Virtual Concierge Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          <span style="width:8px; height:8px; border-radius:50%; background:#25D366;"></span>
          LIVE PHOTOREAL CONCIERGE • VOICE & SMART PAIRINGS
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.2rem, 4.2vw, 3.6rem); color:#FAF7F0; margin-bottom:1rem;">
          Meet <span class="hero-title-accent">Chef Veni</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Your personal artisan patisserie concierge. Speak directly with Chef Veni, tap instant bakery Q&As, or let our intelligent guide curate the perfect celebratory dessert pairing.
        </p>
      </div>
    </section>

    <section class="section-pad bg-black" style="padding-top:10px; padding-bottom:40px;">
      <div class="container" style="max-width:850px; margin:0 auto;">

        <!-- 3D Digital Human Avatar Concierge Card -->
        <div class="hero-avatar-card" id="hero-avatar-card" style="margin-bottom:36px; box-shadow:0 24px 64px rgba(0,0,0,0.85); border:1px solid rgba(213,174,97,0.35);">
          <div class="avatar-card-header">
            <div class="avatar-status-pill">
              <span class="status-indicator-dot"></span>
              <span class="status-indicator-text">LIVE PHOTOREAL CONCIERGE</span>
            </div>
            <div class="avatar-persona-tags" role="tablist" aria-label="Select avatar guide">
              <button class="persona-tab-btn active" data-persona="host" type="button" aria-selected="true">
                <span class="tab-emoji">👩‍🍳</span> Chef Veni
              </button>
              <button class="persona-tab-btn" data-persona="baker" type="button" aria-selected="false">
                <span class="tab-emoji">🧑‍🍳</span> Master Baker
              </button>
              <button class="persona-tab-btn" data-persona="specialist" type="button" aria-selected="false">
                <span class="tab-emoji">✨</span> Stylist
              </button>
            </div>
          </div>

          <div class="avatar-card-body">
            <!-- Host Profile Identity Bar -->
            <div class="avatar-host-bar">
              <div class="avatar-container" id="avatar-container" aria-label="Photorealistic Digital Human Host"></div>
              <div class="avatar-host-meta">
                <div class="avatar-host-name-row">
                  <span class="avatar-host-name" id="avatar-host-name">Chef Veni</span>
                  <span class="avatar-host-badge" id="avatar-host-badge">LIVE HOST</span>
                </div>
                <span class="avatar-host-role" id="avatar-host-role">Founder & Master Baker • Klang</span>
                <div class="avatar-soundwave-bars" id="avatar-soundwave-bars" aria-hidden="true">
                  <span class="sw-bar"></span>
                  <span class="sw-bar"></span>
                  <span class="sw-bar"></span>
                  <span class="sw-bar"></span>
                  <span class="sw-bar"></span>
                </div>
              </div>
              <button class="btn btn-voice-audio" id="hero-voice-toggle-btn" aria-label="Listen to Host Voice">
                <i class="fa-solid fa-volume-high"></i>
                <span class="voice-btn-label">Listen</span>
              </button>
            </div>

            <!-- Avatar Speech & Voice Interaction -->
            <div class="avatar-dialog-column">
              <div class="avatar-speech-bubble" id="avatar-speech-bubble">
                <div class="speech-quote-icon"><i class="fa-solid fa-quote-left"></i></div>
                <p class="speech-text" id="avatar-speech-text">
                  "Welcome to Veni Delights! I am Chef Veni. Every single cake and molten tart is baked fresh to order in Klang using 100% pure butter and natural ingredients."
                </p>
              </div>

              <!-- Quick AI Concierge Pre-Filled Question Chips -->
              <div class="avatar-qa-chips-row" role="region" aria-label="Ask Chef Veni pre-filled questions">
                <div class="qa-chips-header">
                  <span class="qa-chips-prompt">💡 Tap question to ask host:</span>
                </div>
                <div class="qa-chips-scroll" role="tablist" aria-label="Pre-filled bakery questions">
                  <button class="qa-chip-btn" data-qa-id="butter" type="button" title="Do you really use 100% pure butter in all cakes?">
                    <span class="qa-chip-icon">🧈</span>
                    <span class="qa-chip-label">100% Pure Butter?</span>
                  </button>
                  <button class="qa-chip-btn" data-qa-id="bestseller" type="button" title="Which cake is best for a birthday celebration?">
                    <span class="qa-chip-icon">🎂</span>
                    <span class="qa-chip-label">Best Birthday Cake?</span>
                  </button>
                  <button class="qa-chip-btn" data-qa-id="delivery" type="button" title="Do you deliver to Klang, PJ, Subang, and KL?">
                    <span class="qa-chip-icon">🚚</span>
                    <span class="qa-chip-label">Klang & PJ Delivery?</span>
                  </button>
                  <button class="qa-chip-btn" data-qa-id="tarts" type="button" title="How should I reheat the Molten Cheese Tarts for maximum lava flow?">
                    <span class="qa-chip-icon">🧀</span>
                    <span class="qa-chip-label">How to Reheat Tarts?</span>
                  </button>
                  <button class="qa-chip-btn" data-qa-id="pandan" type="button" title="Is the Pandan Layer cake made from real pandan leaves?">
                    <span class="qa-chip-icon">🌿</span>
                    <span class="qa-chip-label">Real Pandan Leaves?</span>
                  </button>
                  <button class="qa-chip-btn" data-qa-id="custom" type="button" title="Can I add a custom chocolate message or birthday toppers?">
                    <span class="qa-chip-icon">✍️</span>
                    <span class="qa-chip-label">Custom Inscriptions?</span>
                  </button>
                </div>
              </div>

              <div class="avatar-action-row">
                <a href="https://wa.me/60123360470?text=Hi%20Chef%20Veni!%20I%20would%20like%20to%20order%20from%20Veni%20Delights." id="avatar-qa-wa-link" class="btn btn-ask-wa" target="_blank" rel="noopener noreferrer">
                  <i class="fa-brands fa-whatsapp"></i>
                  <span>Order on WhatsApp</span>
                </a>
                <a href="#interactive-guide-card" class="btn btn-ask-concierge">
                  <i class="fa-solid fa-comments"></i>
                  <span>Start Pairing Guide</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Dessert Pairing Guide Card -->
        <div class="concierge-card" id="interactive-guide-card" style="background:#140C0B; border:1px solid rgba(213,174,97,0.35); border-radius:24px; padding:32px; box-shadow:0 20px 60px rgba(0,0,0,0.8);">
          <div class="concierge-header" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(213,174,97,0.2); padding-bottom:18px; margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg, #A92D42 0%, #D5AE61 100%); display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.3rem;">
                <i class="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div>
                <h3 style="color:#FAF7F0; font-family:var(--font-display); margin:0; font-size:1.25rem;">Interactive Dessert Pairing Guide</h3>
                <span id="concierge-step-label" style="color:var(--color-gold-champagne); font-size:0.78rem;">Question 1 of 7</span>
              </div>
            </div>
            <button id="concierge-restart" class="btn btn-secondary btn-sm" aria-label="Restart conversation">
              <i class="fa-solid fa-rotate-left"></i> Restart
            </button>
          </div>

          <div id="concierge-messages" style="display:flex; flex-direction:column; gap:16px; min-height:220px; max-height:520px; overflow-y:auto; padding:10px 0;">
            <!-- Rendered by concierge.js -->
          </div>

          <div id="concierge-choices" style="display:flex; flex-wrap:wrap; gap:10px; margin-top:24px; border-top:1px solid rgba(213,174,97,0.2); padding-top:20px;">
            <!-- Rendered by concierge.js -->
          </div>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'concierge.html'), conciergeHTML, 'utf-8');

// 15. GALLERY PAGE (gallery.html)
const galleryItemsHTML = Array.from({ length: 30 }, (_, i) => `
  <article class="gallery-item" data-index="${i}" tabindex="0" role="button" aria-label="View photo ${i + 1}" style="position:relative; border-radius:14px; overflow:hidden; aspect-ratio:1; cursor:pointer; border:1px solid rgba(213,174,97,0.25);" data-reveal>
    <img src="images/gallery/gallery ${i + 1}.jpg" alt="Veni Delights Handcrafted Moment ${i + 1}" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition:transform 0.4s ease;">
    <div style="position:absolute; inset:0; background:rgba(14,8,9,0.5); opacity:0; transition:opacity 0.3s ease; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:1.4rem;">
      <i class="fa-solid fa-expand"></i>
    </div>
  </article>
`).join('\n');

const galleryHTML = wrapHTML({
  title: 'Artisan Gallery & Video Showcase — Veni Delights',
  description: 'Explore 30 high-resolution photos of our celebration cakes, dessert tables, and artisan pastries. Captured across Klang Valley celebrations.',
  activePage: 'gallery',
  canonical: 'gallery.html',
  bodyContent: `
    <section class="category-hero" aria-label="Artisan Gallery Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          30 CURATED MOMENTS • 100% HOMEMADE
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Our Celebration <span class="hero-title-accent">Gallery</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          A visual journey through weddings, birthdays, festive dessert corners, and daily kitchen creations crafted with love in Klang.
        </p>
      </div>
    </section>

    <!-- Cinema Showcase in Gallery -->
    <section class="cinema-section" style="padding:3.5rem 0; background:#0B0708;">
      <div class="container">
        <div class="section-header text-center" data-reveal>
          <span class="section-eyebrow" style="color:var(--color-gold-champagne);">Visual Patisserie Cinema</span>
          <h2 class="section-title text-white">Behind The Craft: The Veni Delights Kitchen</h2>
        </div>
        <div class="cinematic-player-wrap" data-media-id="hero-intro"></div>
      </div>
    </section>

    <!-- Photo Gallery Grid -->
    <section class="section-pad bg-cream">
      <div class="container">
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:20px;" id="gallery-grid">
          ${galleryItemsHTML}
        </div>
      </div>
    </section>

    <!-- Lightbox Modal -->
    <div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="Image Lightbox" aria-hidden="true" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:9999; align-items:center; justify-content:center; padding:20px;">
      <button class="lightbox-close" id="lightbox-close" aria-label="Close lightbox" style="position:absolute; top:24px; right:24px; background:transparent; border:none; color:#FFF; font-size:2rem; cursor:pointer;">
        <i class="fa-solid fa-times"></i>
      </button>
      <button class="lightbox-prev" id="lightbox-prev" aria-label="Previous image" style="position:absolute; left:24px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.15); border:none; color:#FFF; font-size:1.5rem; width:48px; height:48px; border-radius:50%; cursor:pointer;">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <button class="lightbox-next" id="lightbox-next" aria-label="Next image" style="position:absolute; right:24px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,0.15); border:none; color:#FFF; font-size:1.5rem; width:48px; height:48px; border-radius:50%; cursor:pointer;">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
      <div style="text-align:center; max-width:90vw; max-height:85vh;">
        <img id="lightbox-img" src="" alt="Enlarged view" style="max-width:100%; max-height:80vh; border-radius:12px; box-shadow:0 10px 40px rgba(0,0,0,0.8);">
        <div id="lightbox-counter" style="color:var(--color-gold-champagne); margin-top:12px; font-weight:600; font-size:0.9rem;"></div>
      </div>
    </div>
  `
});
fs.writeFileSync(path.join(rootDir, 'gallery.html'), galleryHTML, 'utf-8');

// 16. REVIEWS PAGE (reviews.html)
const REVIEWS_DATA = [
  { name: 'Priya M.', occasion: '1st Birthday Celebration', text: 'The Pandan Layer Cake was the absolute star of my daughter’s birthday party! So soft, fragrant, and not overly sweet. All our guests asked for Veni’s contact.', rating: 5 },
  { name: 'Tan Wei Ling', occasion: 'Wedding Dessert Corner', text: 'Veni Delights setup our wedding dessert table with Package C. It looked like a fairytale! The fruit tarts and brownies disappeared in 15 minutes. Highly recommended!', rating: 5 },
  { name: 'Siti Aminah', occasion: 'Family Gathering', text: 'Best pure butter cake in Klang Valley, hands down. You can taste the real butter from the first bite. Will definitely be my regular bakery.', rating: 5 },
  { name: 'Kavitha R.', occasion: 'Deepavali Festive Platters', text: 'The Kesari and Adhirasam tasted just like my grandmother used to make. Fresh, fragrant ghee and perfect jaggery balance. Thank you Veni!', rating: 5 },
  { name: 'Marcus L.', occasion: 'Office Corporate Event', text: 'Ordered 120 pcs of cheese tarts and egg tarts. Delivered right on time, warm, and exceptionally fresh. Superb quality and professional service.', rating: 5 },
  { name: 'Sarah Chong', occasion: 'Engagement Party', text: 'The Pavlova was a cloud of heaven! Crisp on the outside, light marshmallow inside with fresh strawberries. Everyone was raving about it.', rating: 5 }
];

const reviewsCardsHTML = REVIEWS_DATA.map(r => `
  <div class="card card-dark" style="padding:28px; border-radius:18px; border:1px solid rgba(213,174,97,0.25); display:flex; flex-direction:column; justify-content:space-between;" data-reveal>
    <div>
      <div style="color:#D5AE61; font-size:1.1rem; margin-bottom:12px;">
        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
      </div>
      <p style="color:#FAF7F0; font-size:0.95rem; line-height:1.7; font-style:italic; margin-bottom:18px;">"${r.text}"</p>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.1); padding-top:14px;">
      <strong style="color:var(--color-gold-champagne); display:block; font-size:1rem;">${r.name}</strong>
      <span style="color:#B5AFA3; font-size:0.8rem;">${r.occasion}</span>
    </div>
  </div>
`).join('\n');

const reviewsHTML = wrapHTML({
  title: 'Verified Customer Reviews & Stories — Veni Delights',
  description: 'Read verified 5-star reviews from over 5,000+ happy Klang Valley celebrations. Butter cakes, pandan layer, dessert tables, and festive catering.',
  activePage: 'reviews',
  canonical: 'reviews.html',
  bodyContent: `
    <section class="category-hero" aria-label="Customer Reviews Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          5.0 ★★★★★ RATING • 450+ VERIFIED REVIEWS
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Loved by <span class="hero-title-accent">5,000+ Celebrations</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Real feedback from families, brides, and event planners across Klang, Shah Alam, Subang, PJ, and Kuala Lumpur.
        </p>
      </div>
    </section>

    <!-- Scorecards Section -->
    <section class="section-pad bg-cream">
      <div class="container">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; text-align:center; margin-bottom:3.5rem;">
          <div style="background:#FFF; padding:24px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size:2.4rem; font-weight:800; color:var(--color-primary);">5.0</div>
            <div style="color:#D5AE61; margin:4px 0;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <span style="font-size:0.85rem; color:#666; font-weight:600;">Overall Taste & Flavour</span>
          </div>

          <div style="background:#FFF; padding:24px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size:2.4rem; font-weight:800; color:var(--color-primary);">100%</div>
            <div style="color:#D5AE61; margin:4px 0;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <span style="font-size:0.85rem; color:#666; font-weight:600;">Fresh Pure Butter Quality</span>
          </div>

          <div style="background:#FFF; padding:24px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size:2.4rem; font-weight:800; color:var(--color-primary);">4.9</div>
            <div style="color:#D5AE61; margin:4px 0;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <span style="font-size:0.85rem; color:#666; font-weight:600;">Event Styling & Elegance</span>
          </div>

          <div style="background:#FFF; padding:24px; border-radius:16px; box-shadow:0 4px 15px rgba(0,0,0,0.05);">
            <div style="font-size:2.4rem; font-weight:800; color:var(--color-primary);">99%</div>
            <div style="color:#D5AE61; margin:4px 0;"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
            <span style="font-size:0.85rem; color:#666; font-weight:600;">On-Time Dispatch Rate</span>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:24px;">
          ${reviewsCardsHTML}
        </div>

        <div style="text-align:center; margin-top:3.5rem;">
          <a href="https://wa.me/60123360470?text=Hi%20Veni!%20I'd%20like%20to%20share%20a%20review%20of%20my%20recent%20order." class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp"></i> Leave Your Review on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'reviews.html'), reviewsHTML, 'utf-8');

// 17. FAQ PAGE (faq.html)
const faqAccordionHTML = FAQ.map((item, idx) => `
  <div class="faq-item ${idx === 0 ? 'open' : ''}" style="border:1px solid rgba(213,174,97,0.3); border-radius:14px; margin-bottom:14px; overflow:hidden; background:#140C0B;">
    <button class="faq-question" style="width:100%; text-align:left; padding:20px 24px; background:transparent; border:none; color:#FAF7F0; font-family:var(--font-display); font-size:1.1rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" aria-expanded="${idx === 0 ? 'true' : 'false'}">
      <span>${item.q || item.question}</span>
      <i class="fa-solid fa-chevron-down" style="color:var(--color-gold-champagne); transition:transform 0.3s ease;"></i>
    </button>
    <div class="faq-answer" style="padding:0 24px 20px 24px; color:#B5AFA3; font-size:0.95rem; line-height:1.7;">
      ${item.a || item.answer}
    </div>
  </div>
`).join('\n');

const faqHTML = wrapHTML({
  title: 'Frequently Asked Questions & Care Guide — Veni Delights',
  description: 'Clear answers on advance notice lead times, Klang Valley delivery zones, storage recommendations, Halal compliance, and payment methods.',
  activePage: 'faq',
  canonical: 'faq.html',
  bodyContent: `
    <section class="category-hero" aria-label="FAQ Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          EVERYTHING YOU NEED TO KNOW
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Frequently Asked <span class="hero-title-accent">Questions</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          From lead times and delivery areas to cake storage and dessert corner setups.
        </p>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="container" style="max-width:860px; margin:0 auto;">
        <div id="faq-list">
          ${faqAccordionHTML}
        </div>

        <div class="card card-dark" style="margin-top:3.5rem; padding:32px; border-radius:20px; text-align:center; border:1px solid rgba(213,174,97,0.3);">
          <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:8px;">Still have a question?</h3>
          <p style="color:#B5AFA3; margin-bottom:20px;">We're happy to assist with any custom orders, allergen queries, or delivery arrangements.</p>
          <a href="https://wa.me/60123360470?text=Hi%20Veni%20Delights!%20I%20have%20a%20question%20about..." class="btn btn-primary btn-lg" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp"></i> Chat With Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'faq.html'), faqHTML, 'utf-8');

// 18. CONTACT & LOCATION PAGE (contact.html)
const contactHTML = wrapHTML({
  title: 'Contact Us & Delivery Estimator — Veni Delights Klang',
  description: 'Get in touch with our Klang kitchen. Open daily 9am to 9pm. WhatsApp: 012-336 0470. Delivery available across Klang Valley via Grab, Lalamove, or self-pickup.',
  activePage: 'contact',
  canonical: 'contact.html',
  bodyContent: `
    <section class="category-hero" aria-label="Contact Veni Delights Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          OPEN DAILY • 9:00 AM – 9:00 PM
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Let's Plan Your <span class="hero-title-accent">Sweet Celebration</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Reach out to discuss custom celebration cakes, dessert table styling, bulk corporate orders, or delivery arrangements.
        </p>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="container">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:3rem; align-items:flex-start;">
          
          <!-- Contact Info Cards -->
          <div>
            <div class="card card-dark" style="padding:32px; border-radius:20px; border:1px solid rgba(213,174,97,0.3); margin-bottom:24px;">
              <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem;">Direct Kitchen Contact</h3>
              
              <div style="display:flex; flex-direction:column; gap:18px;">
                <div style="display:flex; gap:16px; align-items:center;">
                  <div style="width:44px; height:44px; border-radius:50%; background:rgba(213,174,97,0.15); display:flex; align-items:center; justify-content:center; color:var(--color-gold-champagne); font-size:1.2rem;">
                    <i class="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <span style="color:#B5AFA3; font-size:0.8rem; display:block;">Call / WhatsApp</span>
                    <a href="tel:+60123360470" style="color:#FAF7F0; font-weight:600; font-size:1.05rem;">012-336 0470</a>
                  </div>
                </div>

                <div style="display:flex; gap:16px; align-items:center;">
                  <div style="width:44px; height:44px; border-radius:50%; background:rgba(213,174,97,0.15); display:flex; align-items:center; justify-content:center; color:var(--color-gold-champagne); font-size:1.2rem;">
                    <i class="fa-solid fa-envelope"></i>
                  </div>
                  <div>
                    <span style="color:#B5AFA3; font-size:0.8rem; display:block;">Email Enquiries</span>
                    <a href="mailto:kagsivasiva15@gmail.com" style="color:#FAF7F0; font-weight:600; font-size:1.05rem;">kagsivasiva15@gmail.com</a>
                  </div>
                </div>

                <div style="display:flex; gap:16px; align-items:center;">
                  <div style="width:44px; height:44px; border-radius:50%; background:rgba(213,174,97,0.15); display:flex; align-items:center; justify-content:center; color:var(--color-gold-champagne); font-size:1.2rem;">
                    <i class="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <span style="color:#B5AFA3; font-size:0.8rem; display:block;">Bakery Location</span>
                    <span style="color:#FAF7F0; font-weight:600; font-size:1.05rem;">Klang, Selangor, Malaysia</span>
                  </div>
                </div>

                <div style="display:flex; gap:16px; align-items:center;">
                  <div style="width:44px; height:44px; border-radius:50%; background:rgba(213,174,97,0.15); display:flex; align-items:center; justify-content:center; color:var(--color-gold-champagne); font-size:1.2rem;">
                    <i class="fa-solid fa-clock"></i>
                  </div>
                  <div>
                    <span style="color:#B5AFA3; font-size:0.8rem; display:block;">Kitchen Operating Hours</span>
                    <span style="color:#FAF7F0; font-weight:600; font-size:1.05rem;">9:00 AM – 9:00 PM Daily</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Zones Card -->
            <div class="card card-dark" style="padding:28px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);">
              <h4 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:12px;">Klang Valley Delivery Zones</h4>
              <ul style="color:#B5AFA3; font-size:0.85rem; display:flex; flex-direction:column; gap:8px;">
                <li><strong style="color:#FAF7F0;">Zone 1 (Klang & Port Klang):</strong> Estimated Grab / Lalamove RM8 – RM15</li>
                <li><strong style="color:#FAF7F0;">Zone 2 (Shah Alam & Subang Jaya):</strong> Estimated RM15 – RM25</li>
                <li><strong style="color:#FAF7F0;">Zone 3 (Petaling Jaya, Puchong, Sunway):</strong> Estimated RM25 – RM35</li>
                <li><strong style="color:#FAF7F0;">Zone 4 (Kuala Lumpur & Cheras):</strong> Estimated RM35 – RM48</li>
                <li><strong style="color:#FAF7F0;">Self-Pickup:</strong> Available daily with prior appointment in Klang.</li>
              </ul>
            </div>
          </div>

          <!-- Quick Message Form -->
          <div class="card card-dark" style="padding:32px; border-radius:20px; border:1px solid rgba(213,174,97,0.3);">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem;">Send A Direct Message</h3>

            <form onsubmit="event.preventDefault(); const name=document.getElementById('msg-name').value; const type=document.getElementById('msg-type').value; const text=document.getElementById('msg-body').value; window.open('https://wa.me/60123360470?text=' + encodeURIComponent('Hi Veni Delights! My name is ' + name + '. I have an enquiry regarding ' + type + ': ' + text), '_blank');">
              <div class="form-group" style="margin-bottom:16px;">
                <label for="msg-name" class="form-label" style="color:#FAF7F0;">Your Name</label>
                <input type="text" id="msg-name" class="form-input" required placeholder="Your full name">
              </div>

              <div class="form-group" style="margin-bottom:16px;">
                <label for="msg-type" class="form-label" style="color:#FAF7F0;">Enquiry Type</label>
                <select id="msg-type" class="form-select">
                  <option>Cake Pre-Order</option>
                  <option>Dessert Corner Catering Setup</option>
                  <option>Custom Cake Design</option>
                  <option>Bulk / Corporate Order</option>
                  <option>Delivery Rate Enquiry</option>
                </select>
              </div>

              <div class="form-group" style="margin-bottom:20px;">
                <label for="msg-body" class="form-label" style="color:#FAF7F0;">Your Message</label>
                <textarea id="msg-body" class="form-textarea" rows="4" required placeholder="Let us know your date, location, and what delicious treats you're looking for..."></textarea>
              </div>

              <button type="submit" class="btn btn-whatsapp btn-full btn-lg">
                <i class="fa-brands fa-whatsapp"></i> Send via WhatsApp
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  `
});
fs.writeFileSync(path.join(rootDir, 'contact.html'), contactHTML, 'utf-8');

// 19. ORDER REVIEW & CHECKOUT (order.html)
const orderHTML = wrapHTML({
  title: 'Review Your Order & WhatsApp Checkout — Veni Delights',
  description: 'Review your selected cakes and pastries, customize delivery preferences, and launch formatted WhatsApp order checkout with one click.',
  activePage: 'order',
  canonical: 'order.html',
  bodyContent: `
    <section class="category-hero" aria-label="Order Checkout Hero">
      <div class="container text-center" style="max-width:850px; margin:0 auto;">
        <span class="hero-badge-pill" style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:99px; background:rgba(213,174,97,0.15); border:1px solid rgba(213,174,97,0.3); color:var(--color-gold-champagne); font-size:0.78rem; font-weight:600; margin-bottom:1.25rem;">
          <i class="fa-solid fa-lock"></i> DIRECT WHATSAPP CHECKOUT • 5 DAYS NOTICE
        </span>
        <h1 class="hero-title" style="font-size:clamp(2.4rem, 4.5vw, 3.8rem); color:#FAF7F0; margin-bottom:1rem;">
          Your Handcrafted <span class="hero-title-accent">Order Summary</span>
        </h1>
        <p class="hero-subtitle" style="color:#d5c5bc; font-size:1.05rem; line-height:1.7;">
          Review your selected items, enter your delivery preferences, and confirm your order directly on WhatsApp.
        </p>
      </div>
    </section>

    <section class="section-pad bg-cream">
      <div class="container">
        <div class="checkout-grid">
          
          <!-- Order Items Table Card -->
          <div class="card card-dark checkout-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:14px;">
              <h3 style="color:#FAF7F0; font-family:var(--font-display); margin:0;">Selected Creations</h3>
              <a href="products.html" class="btn btn-secondary btn-sm"><i class="fa-solid fa-plus"></i> Add More Items</a>
            </div>

            <div id="checkout-items-list" style="display:flex; flex-direction:column; gap:16px;">
              <!-- Rendered via Client JS from localStorage -->
              <p style="color:#B5AFA3; font-style:italic;">Loading your selected items...</p>
            </div>

            <div style="margin-top:28px; border-top:1px solid rgba(255,255,255,0.1); padding-top:20px; display:flex; justify-content:space-between; align-items:center;">
              <span style="color:#B5AFA3; font-size:1.1rem;">Estimated Subtotal:</span>
              <strong id="checkout-subtotal" style="color:var(--color-gold-champagne); font-size:1.6rem;">RM0.00</strong>
            </div>
          </div>

          <!-- Checkout Details Card -->
          <div class="card card-dark checkout-card checkout-details-card">
            <h3 style="color:#FAF7F0; font-family:var(--font-display); margin-bottom:1.5rem;">Delivery & Customer Info</h3>

            <div class="form-group" style="margin-bottom:14px;">
              <label for="chk-name" class="form-label" style="color:#FAF7F0;">Full Name</label>
              <input type="text" id="chk-name" class="form-input" required placeholder="Your name">
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label for="chk-phone" class="form-label" style="color:#FAF7F0;">WhatsApp Phone Number</label>
              <input type="tel" id="chk-phone" class="form-input" required placeholder="e.g. 012-345 6789">
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label for="chk-date" class="form-label" style="color:#FAF7F0;">Preferred Date (Min 5 Days Notice)</label>
              <input type="date" id="chk-date" class="form-input" required>
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label for="chk-delivery" class="form-label" style="color:#FAF7F0;">Collection / Delivery Method</label>
              <select id="chk-delivery" class="form-select">
                <option value="Self Pickup (Klang)">Self-Pickup (Klang Kitchen)</option>
                <option value="Grab Express">Grab Express</option>
                <option value="Lalamove">Lalamove</option>
                <option value="Direct Bakery Delivery">Direct Bakery Delivery</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom:14px;">
              <label for="chk-address" class="form-label" style="color:#FAF7F0;">Delivery Address (If Applicable)</label>
              <input type="text" id="chk-address" class="form-input" placeholder="e.g. No. 12, Jalan SS2/1, Petaling Jaya">
            </div>

            <div class="form-group" style="margin-bottom:20px;">
              <label for="chk-notes" class="form-label" style="color:#FAF7F0;">Cake Inscription / Special Instructions</label>
              <textarea id="chk-notes" class="form-textarea" rows="2" placeholder="e.g. Inscription: Happy Birthday Sarah! Extra birthday candles."></textarea>
            </div>

            <button class="btn btn-whatsapp btn-full btn-lg" id="chk-submit-btn">
              <i class="fa-brands fa-whatsapp"></i> Confirm & Submit via WhatsApp
            </button>
            <p style="font-size:0.75rem; color:#B5AFA3; text-align:center; margin-top:10px;">
              No payment is taken online. Orders are finalized with payment details (DuitNow / Transfer) upon WhatsApp reply.
            </p>
          </div>

        </div>
      </div>
    </section>

    <script>
      document.addEventListener('DOMContentLoaded', () => {
        const listEl = document.getElementById('checkout-items-list');
        const subtotalEl = document.getElementById('checkout-subtotal');
        const submitBtn = document.getElementById('chk-submit-btn');

        function loadItems() {
          let raw = localStorage.getItem('veni_delights_cart');
          if (!raw) raw = localStorage.getItem('veni_order_items');
          let items = [];
          try {
            if (raw) items = JSON.parse(raw);
          } catch(e) {}

          if (!items || items.length === 0) {
            listEl.innerHTML = \`
              <div style="text-align:center; padding:30px 0;">
                <i class="fa-solid fa-shopping-basket" style="font-size:2.5rem; color:#B5AFA3; margin-bottom:12px;"></i>
                <p style="color:#B5AFA3; margin-bottom:16px;">Your order builder is currently empty.</p>
                <a href="products.html" class="btn btn-primary">Browse All Products</a>
              </div>
            \`;
            subtotalEl.textContent = 'RM0.00';
            if (submitBtn) submitBtn.disabled = true;
            return;
          }

          let total = 0;
          listEl.innerHTML = items.map((item, idx) => {
            const itemTotal = (item.price || 0) * (item.quantity || 1);
            total += itemTotal;
            return \`
              <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:rgba(255,255,255,0.05); border-radius:12px;">
                <div style="display:flex; align-items:center; gap:14px;">
                  <img src="\${item.image || 'images/product/butter series/pure butter.png'}" alt="\${item.name}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;">
                  <div>
                    <h4 style="color:#FAF7F0; margin:0; font-size:0.95rem;">\${item.name}</h4>
                    <span style="color:#B5AFA3; font-size:0.8rem;">Qty: \${item.quantity} \${item.price ? '× RM' + item.price : ''}</span>
                  </div>
                </div>
                <div style="text-align:right;">
                  <strong style="color:var(--color-gold-champagne); font-size:1.05rem;">\${item.price ? 'RM' + itemTotal.toFixed(2) : 'Contact'}</strong>
                  <button class="remove-item-btn" data-idx="\${idx}" style="display:block; background:transparent; border:none; color:#E74C3C; font-size:0.75rem; margin-top:4px; cursor:pointer;">Remove</button>
                </div>
              </div>
            \`;
          }).join('');

          subtotalEl.textContent = 'RM' + total.toFixed(2);
          if (submitBtn) submitBtn.disabled = false;

          document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => {
              const idx = parseInt(btn.dataset.idx, 10);
              items.splice(idx, 1);
              localStorage.setItem('veni_delights_cart', JSON.stringify(items));
              localStorage.setItem('veni_order_items', JSON.stringify(items));
              window.dispatchEvent(new CustomEvent('cart-updated'));
              loadItems();
            });
          });
        }

        loadItems();

        if (submitBtn) {
          submitBtn.addEventListener('click', () => {
            let raw = localStorage.getItem('veni_delights_cart');
            if (!raw) raw = localStorage.getItem('veni_order_items');
            let items = [];
            try { items = JSON.parse(raw); } catch(e){}

            if (!items || items.length === 0) {
              alert('Your order builder is empty. Please add items from our menu first!');
              return;
            }

            const name = document.getElementById('chk-name').value.trim();
            const phone = document.getElementById('chk-phone').value.trim();
            const date = document.getElementById('chk-date').value;
            const delivery = document.getElementById('chk-delivery').value;
            const address = document.getElementById('chk-address').value.trim();
            const notes = document.getElementById('chk-notes').value.trim();

            const customerName = name || 'Customer (Web Order)';

            let total = 0;
            const itemLines = items.map((it, i) => {
              const qty = parseInt(it.quantity || it.qty || 1, 10);
              let line = (i + 1) + '. *' + it.name + '*';
              if (it.variant) line += ' (' + it.variant + ')';
              line += '\\n   Qty: ' + qty;
              if (typeof it.price === 'number' && it.price > 0) {
                const itTotal = it.price * qty;
                total += itTotal;
                line += ' × RM' + it.price.toFixed(2) + ' = *RM' + itTotal.toFixed(2) + '*';
              } else if (it.priceDisplay) {
                line += ' — ' + it.priceDisplay;
              }
              return line;
            }).join('\\n\\n');

            let msg = '🎂 *NEW ORDER — VENI DELIGHTS (Klang)*\\n';
            msg += '─────────────────────────\\n';
            msg += '👤 *Customer Name:* ' + customerName + '\\n';
            if (phone) msg += '📱 *Phone / WhatsApp:* ' + phone + '\\n';
            if (date) msg += '📅 *Preferred Date:* ' + date + '\\n';
            if (delivery) msg += '🚚 *Collection / Delivery:* ' + delivery + '\\n';
            if (address) msg += '📍 *Delivery Address:* ' + address + '\\n';
            if (notes) msg += '📝 *Special Inscription / Notes:* ' + notes + '\\n';
            msg += '─────────────────────────\\n';
            msg += '📦 *ORDERED CREATIONS:*\\n' + itemLines + '\\n';
            msg += '─────────────────────────\\n';
            if (total > 0) {
              msg += '💰 *ESTIMATED SUBTOTAL:* *RM' + total.toFixed(2) + '*\\n';
              msg += '_*(Delivery fee calculated by distance upon confirmation)*_\\n\\n';
            }
            msg += 'Please confirm availability and banking/DuitNow payment details. Thank you! 🙏';

            const waUrl = 'https://wa.me/60123360470?text=' + encodeURIComponent(msg);
            const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
            if (isMobile) {
              window.location.href = waUrl;
            } else {
              try {
                const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
                if (!win || win.closed || typeof win.closed === 'undefined') {
                  window.location.href = waUrl;
                }
              } catch (e) {
                window.location.href = waUrl;
              }
            }
          });
        }
      });
    </script>
  `
});
fs.writeFileSync(path.join(rootDir, 'order.html'), orderHTML, 'utf-8');

console.log('✅ All 19 pages generated successfully!');
