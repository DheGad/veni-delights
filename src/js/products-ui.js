/**
 * VENI DELIGHTS — PRODUCTS UI MODULE
 * Renders all verified products from the master data,
 * handles category navigation filtering, quick actions,
 * quantity changes, direct WhatsApp buttons, and order drawer integration.
 */

import { PRODUCTS, calculateTartPrice } from '../data/products.js';
import { buildSimpleOrderURL, openWhatsApp } from './whatsapp.js';

export class ProductsUI {
  constructor(orderDrawer) {
    this.orderDrawer = orderDrawer;
    this.categoryNavBtns = document.querySelectorAll('.product-nav-btn');
    this.categoryBlocks = document.querySelectorAll('.product-category-block');

    this.init();
  }

  init() {
    this.renderAllCategories();
    this.bindCategoryTabs();
  }

  renderAllCategories() {
    // 1. Butter Series
    this.renderCategoryGrid('butter-grid', 'butter-series');

    // 2. Brownies
    this.renderCategoryGrid('brownies-grid', 'brownies');

    // 3. Pandan Layer Cake
    this.renderCategoryGrid('pandan-grid', 'pandan-layer');

    // 4. Pavlova
    this.renderCategoryGrid('pavlova-grid', 'pavlova');

    // 5. Fruit Tart
    this.renderCategoryGrid('fruit-tart-grid', 'fruit-tart');

    // 6. Egg Tart
    this.renderCategoryGrid('egg-tart-grid', 'egg-tart');

    // 7. Cheese Tart
    this.renderCategoryGrid('cheese-tart-grid', 'cheese-tart');

    // 8. Traditional Indian Desserts
    this.renderCategoryGrid('indian-desserts-grid', 'indian-desserts');

    // 9. Kuih Muih
    this.renderCategoryGrid('kuih-grid', 'kuih-muih');
  }

  renderCategoryGrid(gridElementId, categoryId) {
    const grid = document.getElementById(gridElementId);
    if (!grid) return;

    const category = PRODUCTS.find(c => c.id === categoryId);
    if (!category) return;

    grid.innerHTML = '';

    category.items.forEach(item => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.setAttribute('data-reveal', '');

      const isEnquiry = item.isEnquiry || !item.price;
      const minQty = item.minimumOrder || 1;

      card.innerHTML = `
        <div class="product-card-img-wrap">
          <img src="${item.image}" alt="${item.alt || item.name}" class="product-card-img" loading="lazy">
          <div class="product-card-badges">
            ${item.tags ? item.tags.map(t => `<span class="badge badge-gold">${t}</span>`).join('') : ''}
          </div>
          ${!isEnquiry ? `
            <div class="product-card-add-overlay">
              <button class="product-card-add-btn add-to-cart" title="Add to Order Builder" aria-label="Add ${item.name} to order">
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
            <button class="btn btn-primary direct-wa-btn" aria-label="Order ${item.name} via WhatsApp">
              <i class="fa-brands fa-whatsapp" aria-hidden="true"></i>
              ${isEnquiry ? 'Enquire' : 'Order'}
            </button>
            ${!isEnquiry ? `
              <button class="btn btn-secondary add-drawer-btn" aria-label="Add ${item.name} to order builder">
                <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
              </button>
            ` : ''}
          </div>
        </div>
      `;

      // Direct WhatsApp Order Event
      const waBtn = card.querySelector('.direct-wa-btn');
      if (waBtn) {
        waBtn.addEventListener('click', () => {
          const waUrl = buildSimpleOrderURL(item.whatsappText);
          openWhatsApp(waUrl, waBtn);
        });
      }

      // Add to Order Drawer Event
      const addBtns = card.querySelectorAll('.add-to-cart, .add-drawer-btn');
      addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (this.orderDrawer) {
            this.orderDrawer.addItem({
              id: item.id,
              name: item.name,
              variant: item.variant || null,
              price: item.price || null,
              priceDisplay: item.priceDisplay || (item.price ? `RM${item.price}` : 'Pricing on enquiry'),
              minimumOrder: minQty,
              image: item.image,
              quantity: minQty
            });
          }
        });
      });

      grid.appendChild(card);
    });
  }

  bindCategoryTabs() {
    this.categoryNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCategory = btn.dataset.category;

        // Active class toggle
        this.categoryNavBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        // Filter category blocks
        this.categoryBlocks.forEach(block => {
          const blockCat = block.dataset.categoryBlock;
          if (targetCategory === 'all' || blockCat === targetCategory) {
            block.style.display = 'block';
          } else {
            block.style.display = 'none';
          }
        });
      });
    });
  }
}
