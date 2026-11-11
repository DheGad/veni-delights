/**
 * VENI DELIGHTS — ORDER DRAWER / CART MODULE
 * Manages customer order builder state, multi-item selection,
 * quantities, customer details, and validated WhatsApp handoff.
 */

import { buildProductOrderURL, openWhatsApp, validateOrder } from './whatsapp.js';

export class OrderDrawer {
  constructor() {
    this.drawerEl = document.getElementById('order-drawer');
    this.overlayEl = document.getElementById('order-drawer-overlay');
    this.closeBtn = document.getElementById('order-drawer-close');
    this.bodyEl = document.getElementById('order-drawer-body');
    this.emptyEl = document.getElementById('order-drawer-empty');
    this.detailsEl = document.getElementById('order-drawer-details');
    this.submitBtn = document.getElementById('order-wa-btn');

    this.customerNameInput = document.getElementById('order-name');
    this.dateInput = document.getElementById('order-date');
    this.deliverySelect = document.getElementById('order-delivery');
    this.instructionsInput = document.getElementById('order-instructions');
    this.totalEl = document.getElementById('order-drawer-total');

    this.items = []; // Array of { id, name, variant, price, priceDisplay, quantity, image, minimumOrder }

    this.bindEvents();
    this.loadFromStorage();
    this.render();
  }

  bindEvents() {
    // Open trigger on page
    const openBtn = document.getElementById('open-order-builder');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.open());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    // Browse button inside empty state
    const browseBtn = document.getElementById('order-browse-btn');
    if (browseBtn) {
      browseBtn.addEventListener('click', () => this.close());
    }

    // Submit to WhatsApp
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.submitOrder());
    }

    // Escape key to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open() {
    if (!this.drawerEl) return;
    this.drawerEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (this.customerNameInput) this.customerNameInput.focus();
  }

  close() {
    if (!this.drawerEl) return;
    this.drawerEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  isOpen() {
    return this.drawerEl && this.drawerEl.getAttribute('aria-hidden') === 'false';
  }

  addItem(item) {
    const existingIndex = this.items.findIndex(
      i => i.id === item.id && i.variant === item.variant
    );

    const min = item.minimumOrder || 1;

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += 1;
    } else {
      this.items.push({
        ...item,
        quantity: Math.max(item.quantity || 1, min)
      });
    }

    this.saveToStorage();
    this.render();
    this.open();
    this.showToast(`Added "${item.name}" to your order.`);
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.saveToStorage();
    this.render();
  }

  updateQuantity(index, newQty) {
    const item = this.items[index];
    const min = item.minimumOrder || 1;

    if (newQty < min) {
      this.showToast(`Minimum order for ${item.name} is ${min} pieces.`);
      return;
    }

    item.quantity = newQty;
    this.saveToStorage();
    this.render();
  }

  calculateTotal() {
    let total = 0;
    let hasEnquiryOnly = false;

    this.items.forEach(item => {
      if (typeof item.price === 'number') {
        total += item.price * item.quantity;
      } else {
        hasEnquiryOnly = true;
      }
    });

    return { total, hasEnquiryOnly };
  }

  render() {
    if (!this.bodyEl) return;

    if (this.items.length === 0) {
      if (this.emptyEl) this.emptyEl.style.display = 'flex';
      if (this.detailsEl) this.detailsEl.hidden = true;
      if (this.submitBtn) this.submitBtn.disabled = true;
      if (this.totalEl) {
        this.totalEl.textContent = 'RM0.00';
        if (this.totalEl.parentElement) this.totalEl.parentElement.style.color = 'var(--color-text, #1A1A1A)';
      }

      // Remove existing item rows
      const existingRows = this.bodyEl.querySelectorAll('.order-item, .order-total-bar');
      existingRows.forEach(r => r.remove());
      return;
    }

    if (this.emptyEl) this.emptyEl.style.display = 'none';
    if (this.detailsEl) this.detailsEl.hidden = false;
    if (this.submitBtn) this.submitBtn.disabled = false;

    // Clear previous rows
    const existingRows = this.bodyEl.querySelectorAll('.order-item, .order-total-bar');
    existingRows.forEach(r => r.remove());

    // Render each item
    this.items.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'order-item';
      row.innerHTML = `
        <img src="${item.image || 'images/logo/logo.jpg'}" alt="${item.name}" class="order-item-img">
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          ${item.variant ? `<div class="order-item-variant">${item.variant}</div>` : ''}
          <div class="order-item-price">${item.priceDisplay || (item.price ? `RM${item.price}` : 'Pricing on enquiry')}</div>
        </div>
        <div class="order-item-controls">
          <button class="qty-btn qty-minus" aria-label="Decrease quantity" data-index="${index}">-</button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn qty-plus" aria-label="Increase quantity" data-index="${index}">+</button>
          <button class="order-item-remove" aria-label="Remove item" data-index="${index}">
            <i class="fa-solid fa-trash-can" aria-hidden="true"></i>
          </button>
        </div>
      `;

      row.querySelector('.qty-minus').addEventListener('click', () => {
        this.updateQuantity(index, item.quantity - 1);
      });

      row.querySelector('.qty-plus').addEventListener('click', () => {
        this.updateQuantity(index, item.quantity + 1);
      });

      row.querySelector('.order-item-remove').addEventListener('click', () => {
        this.removeItem(index);
      });

      this.bodyEl.appendChild(row);
    });

    // Render Total Summary Bar & Checkout Page Link
    const { total, hasEnquiryOnly } = this.calculateTotal();
    if (this.totalEl) {
      this.totalEl.textContent = `RM${total.toFixed(2)}${hasEnquiryOnly ? ' +' : ''}`;
      if (this.totalEl.parentElement) this.totalEl.parentElement.style.color = 'var(--color-text, #1A1A1A)';
    }
    const totalBar = document.createElement('div');
    totalBar.className = 'order-total-bar';
    totalBar.style.padding = 'var(--space-4) 0';
    totalBar.style.borderTop = '2px solid var(--color-border-dark)';
    totalBar.style.marginTop = 'var(--space-4)';
    totalBar.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span style="font-weight:600; font-size:1.05rem;">Estimated Subtotal:</span>
        <span style="font-family:var(--font-display); font-size:1.45rem; font-weight:700; color:var(--color-primary);">
          RM${total.toFixed(2)}${hasEnquiryOnly ? ' + Enquiry items' : ''}
        </span>
      </div>
      <p style="font-size:0.75rem; color:var(--color-text-muted); margin-top:4px; margin-bottom:12px;">
        *Direct WhatsApp checkout. Final pricing confirmed upon chat reply.
      </p>
      <a href="order.html" class="btn btn-secondary btn-full btn-sm" style="display:flex; align-items:center; justify-content:center; gap:8px; text-decoration:none; margin-bottom:4px;">
        <i class="fa-solid fa-file-invoice" aria-hidden="true"></i> Review Full Order & Delivery Form
      </a>
    `;
    this.bodyEl.appendChild(totalBar);
  }

  submitOrder() {
    const validation = validateOrder(this.items);
    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    const orderData = {
      customerName: this.customerNameInput?.value.trim() || '',
      preferredDate: this.dateInput?.value || '',
      deliveryPreference: this.deliverySelect?.value || '',
      specialInstructions: this.instructionsInput?.value.trim() || '',
      items: this.items
    };

    const waUrl = buildProductOrderURL(orderData);
    openWhatsApp(waUrl, this.submitBtn);
  }

  saveToStorage() {
    try {
      localStorage.setItem('veni_delights_cart', JSON.stringify(this.items));
      localStorage.setItem('veni_order_items', JSON.stringify(this.items));
      window.dispatchEvent(new CustomEvent('cart-updated'));
    } catch (e) {
      // Storage unavailable or disabled
    }
  }

  loadFromStorage() {
    try {
      let saved = localStorage.getItem('veni_delights_cart');
      if (!saved) {
        saved = localStorage.getItem('veni_order_items');
      }
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  }

  showToast(message) {
    let toast = document.getElementById('veni-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'veni-toast';
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(10,10,8,0.92);
        color: #FAF7F0;
        border: 1px solid #C9A84C;
        padding: 12px 24px;
        border-radius: 9999px;
        font-size: 14px;
        z-index: 99999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2800);
  }
}
