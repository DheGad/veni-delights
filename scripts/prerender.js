import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCTS, DESSERT_CORNER, FAQ } from '../src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.join(__dirname, '..', 'index.html');

let html = fs.readFileSync(indexPath, 'utf-8');

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

function renderCategoryHTML(catId) {
  const cat = PRODUCTS.find(c => c.id === catId);
  if (!cat) return '';
  return cat.items.map(renderProductCard).join('\n');
}

// 1. Butter Series
html = html.replace(
  '<div class="product-grid" id="butter-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="butter-grid">\n${renderCategoryHTML('butter-series')}\n        </div>`
);

// 2. Brownies
html = html.replace(
  '<div class="product-grid" id="brownies-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="brownies-grid">\n${renderCategoryHTML('brownies')}\n        </div>`
);

// 3. Pandan Layer
html = html.replace(
  '<div class="product-grid product-grid-sm" id="pandan-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid product-grid-sm" id="pandan-grid">\n${renderCategoryHTML('pandan-layer')}\n        </div>`
);

// 4. Pavlova
html = html.replace(
  '<div class="product-grid" id="pavlova-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="pavlova-grid">\n${renderCategoryHTML('pavlova')}\n        </div>`
);

// 5. Fruit Tart
html = html.replace(
  '<div class="product-grid product-grid-sm" id="fruit-tart-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid product-grid-sm" id="fruit-tart-grid">\n${renderCategoryHTML('fruit-tart')}\n        </div>`
);

// 6. Egg Tart
html = html.replace(
  '<div class="product-grid product-grid-sm" id="egg-tart-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid product-grid-sm" id="egg-tart-grid">\n${renderCategoryHTML('egg-tart')}\n        </div>`
);

// 7. Cheese Tart
html = html.replace(
  '<div class="product-grid" id="cheese-tart-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="cheese-tart-grid">\n${renderCategoryHTML('cheese-tart')}\n        </div>`
);

// 8. Indian Desserts
html = html.replace(
  '<div class="product-grid" id="indian-desserts-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="indian-desserts-grid">\n${renderCategoryHTML('indian-desserts')}\n        </div>`
);

// 9. Kuih Muih
html = html.replace(
  '<div class="product-grid" id="kuih-grid">\n          <!-- Dynamically rendered by JS -->\n        </div>',
  `<div class="product-grid" id="kuih-grid">\n${renderCategoryHTML('kuih-muih')}\n        </div>`
);

// 10. Dessert Corner Packages
const packagesHTML = DESSERT_CORNER.packages.map(pkg => `
  <article class="dessert-package-card ${pkg.recommended ? 'recommended' : ''}" data-reveal>
    ${pkg.recommended ? '<div class="dessert-package-badge"><span class="badge badge-gold">Most Popular</span></div>' : ''}
    <div class="dessert-package-img-wrap">
      <img src="${pkg.image}" alt="${pkg.alt}" class="dessert-package-img" loading="lazy">
    </div>
    <div class="dessert-package-body">
      <h3 class="dessert-package-name">${pkg.name}</h3>
      <div class="dessert-package-price">${pkg.priceDisplay}</div>
      <ul class="dessert-package-items">
        ${pkg.items.map(it => `
          <li class="dessert-package-item">
            <i class="fa-solid fa-check" aria-hidden="true"></i>
            <span>${it}</span>
          </li>
        `).join('')}
      </ul>
      <div class="dessert-package-actions">
        <button class="btn btn-primary btn-full pkg-select-btn" data-pkg-id="${pkg.id}">
          Select Package
        </button>
        <a href="https://wa.me/60123360470?text=${encodeURIComponent(pkg.whatsappText)}"
           class="btn btn-secondary btn-full"
           target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
          Enquire Package
        </a>
      </div>
    </div>
  </article>
`).join('\n');

html = html.replace(
  '<div class="dessert-packages-grid" id="dessert-packages-grid">\n      <!-- Rendered by JS -->\n    </div>',
  `<div class="dessert-packages-grid" id="dessert-packages-grid">\n${packagesHTML}\n    </div>`
);

// 11. Add-ons
const addonsHTML = DESSERT_CORNER.addOns.map(addon => `
  <div class="addon-card" data-addon-id="${addon.id}" data-reveal>
    <span class="addon-card-icon">${addon.icon}</span>
    <div class="addon-card-name">${addon.name}</div>
    <div class="addon-card-price">${addon.priceDisplay}</div>
  </div>
`).join('\n');

html = html.replace(
  '<div class="addons-grid" id="addons-grid">\n        <!-- Rendered by JS -->\n      </div>',
  `<div class="addons-grid" id="addons-grid">\n${addonsHTML}\n      </div>`
);

// 12. Gallery items (all 30)
const galleryHTML = Array.from({ length: 30 }, (_, i) => `
  <div class="gallery-item" role="listitem" tabindex="0" aria-label="View image ${i+1} of 30" data-index="${i}" data-reveal>
    <img src="images/gallery/gallery ${i+1}.jpg" alt="Veni Delights Handcrafted Bakery & Event Display ${i+1}" loading="lazy">
    <div class="gallery-item-overlay" aria-hidden="true">
      <i class="fa-solid fa-expand"></i>
    </div>
  </div>
`).join('\n');

html = html.replace(
  '<div class="gallery-grid" id="gallery-grid" role="list" aria-label="Product gallery">\n      <!-- Rendered by JS -->\n    </div>',
  `<div class="gallery-grid" id="gallery-grid" role="list" aria-label="Product gallery">\n${galleryHTML}\n    </div>`
);

// 13. Customer Reviews (all 12)
const reviewsHTML = Array.from({ length: 12 }, (_, i) => `
  <div class="swiper-slide">
    <div class="card card-dark" style="padding:var(--space-2); height:100%; display:flex; align-items:center; justify-content:center;">
      <img src="images/testimonials/review ${i+1}.png" alt="Genuine Customer Review and Feedback ${i+1} for Veni Delights" loading="lazy" style="max-height:480px; width:auto; border-radius:var(--radius-lg);">
    </div>
  </div>
`).join('\n');

html = html.replace(
  '<div class="swiper-wrapper" id="reviews-wrapper">\n        <!-- Rendered by JS -->\n      </div>',
  `<div class="swiper-wrapper" id="reviews-wrapper">\n${reviewsHTML}\n      </div>`
);

// 14. FAQ Items
const faqHTML = FAQ.map((item, index) => `
  <div class="faq-item" role="listitem" data-reveal>
    <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${index}">
      <span>${item.q}</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
    <div class="faq-answer" id="faq-ans-${index}" role="region" aria-label="${item.q}">
      <div class="faq-answer-inner">
        <p>${item.a}</p>
      </div>
    </div>
  </div>
`).join('\n');

html = html.replace(
  '<div class="faq-list" id="faq-list" role="list">\n      <!-- Rendered by JS -->\n    </div>',
  `<div class="faq-list" id="faq-list" role="list">\n${faqHTML}\n    </div>`
);

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully pre-rendered all products, packages, gallery, reviews, and FAQs into index.html!');
