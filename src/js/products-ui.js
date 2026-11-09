/**
 * VENI DELIGHTS — PRODUCTS UI MODULE
 * Manages category navigation, add-to-drawer events,
 * and direct WhatsApp ordering.
 */

import { PRODUCTS } from '../data/products.js';
import { buildSimpleOrderURL, openWhatsApp } from './whatsapp.js';

export class ProductsUI {
  constructor(orderDrawer) {
    this.orderDrawer = orderDrawer;
    this.categoryNavBtns = document.querySelectorAll('.product-nav-btn');
    this.categoryBlocks = document.querySelectorAll('.product-category-block');

    this.init();
  }

  init() {
    this.bindEventsToAllCards();
    this.bindCategoryTabs();
  }

  bindEventsToAllCards() {
    // Find all products across all categories
    const allItems = [];
    PRODUCTS.forEach(c => allItems.push(...c.items));

    // Bind Add to Cart & Direct WhatsApp for every card
    document.querySelectorAll('.product-card').forEach(card => {
      const addBtns = card.querySelectorAll('.add-to-cart, .add-drawer-btn');
      addBtns.forEach(btn => {
        const prodId = btn.dataset.productId;
        const item = allItems.find(i => i.id === prodId);
        if (item) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.orderDrawer) {
              const minQty = item.minimumOrder || 1;
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
        }
      });
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
