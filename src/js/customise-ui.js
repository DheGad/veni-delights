/**
 * VENI DELIGHTS — CAKE CUSTOMISATION MODULE
 * Standalone interactive cake customisation experience with live visual preview,
 * message formatting, date picker, special requirements, and WhatsApp handoff.
 */

import { openWhatsApp } from './whatsapp.js';
import { BUSINESS } from '../data/products.js';

export class CustomiseUI {
  constructor() {
    this.productSelect = document.getElementById('custom-product');
    this.occasionSelect = document.getElementById('custom-occasion');
    this.messageInput = document.getElementById('custom-message');
    this.qtyInput = document.getElementById('custom-qty');
    this.colourInput = document.getElementById('custom-colour');
    this.specialInput = document.getElementById('custom-special');
    this.nameInput = document.getElementById('custom-name');
    this.dateInput = document.getElementById('custom-date');
    this.submitBtn = document.getElementById('customise-wa-btn');

    // Preview elements
    this.previewImg = document.getElementById('customise-preview-img');
    this.previewName = document.getElementById('preview-name');
    this.previewTags = document.getElementById('preview-tags');
    this.previewFields = document.getElementById('preview-fields');

    this.bindEvents();
    this.updatePreview();
  }

  bindEvents() {
    const inputs = [
      this.productSelect,
      this.occasionSelect,
      this.messageInput,
      this.qtyInput,
      this.colourInput,
      this.specialInput,
      this.nameInput,
      this.dateInput
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.updatePreview());
        input.addEventListener('change', () => this.updatePreview());
      }
    });

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.submitCustomisation());
    }
  }

  updatePreview() {
    if (!this.productSelect) return;

    const selectedOption = this.productSelect.options[this.productSelect.selectedIndex];
    if (!selectedOption) return;

    const productName = selectedOption.text.split('—')[0].trim();
    const priceText = selectedOption.dataset.price || 'RM79';
    const imgSrc = selectedOption.dataset.img || 'images/product/butter series/pure butter.png';

    // Update image & title
    if (this.previewImg) this.previewImg.src = imgSrc;
    if (this.previewName) this.previewName.textContent = productName;

    // Update tags
    if (this.previewTags) {
      this.previewTags.innerHTML = `
        <span class="badge badge-gold">${priceText}</span>
        ${this.occasionSelect?.value ? `<span class="badge badge-cream">${this.occasionSelect.value}</span>` : ''}
      `;
    }

    // Update dynamic fields
    if (this.previewFields) {
      const occasion = this.occasionSelect?.value || 'Not specified';
      const message = this.messageInput?.value.trim() || 'No message';
      const qty = this.qtyInput?.value || '1';
      const colour = this.colourInput?.value.trim() || 'Standard';

      this.previewFields.innerHTML = `
        <div class="preview-field">
          <span class="preview-field-label">Occasion:</span>
          <span class="preview-field-value">${occasion}</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Cake Inscription:</span>
          <span class="preview-field-value">${message}</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Quantity:</span>
          <span class="preview-field-value">${qty} unit(s)</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Colour Theme:</span>
          <span class="preview-field-value">${colour}</span>
        </div>
      `;
    }
  }

  submitCustomisation() {
    const selectedOption = this.productSelect?.options[this.productSelect.selectedIndex];
    const productName = selectedOption ? selectedOption.text : 'Custom Cake';

    const occasion = this.occasionSelect?.value || '';
    const message = this.messageInput?.value.trim() || '';
    const qty = this.qtyInput?.value || '1';
    const colour = this.colourInput?.value.trim() || '';
    const special = this.specialInput?.value.trim() || '';
    const customerName = this.nameInput?.value.trim() || '';
    const requiredDate = this.dateInput?.value || '';

    const lines = [
      'Hello Veni Delights! 👋',
      '',
      'I would like to enquire about a *Custom Cake* design.',
      '',
      `🎂 *Product Base:* ${productName}`,
      occasion ? `🎉 *Occasion:* ${occasion}` : '',
      message ? `✍️ *Custom Cake Message:* "${message}"` : '',
      `📦 *Quantity:* ${qty}`,
      colour ? `🎨 *Colour Theme:* ${colour}` : '',
      special ? `📝 *Special Requests:* ${special}` : '',
      requiredDate ? `📅 *Required Date:* ${requiredDate}` : '',
      customerName ? `👤 *Customer Name:* ${customerName}` : '',
      '',
      'Please advise on availability and final quotation.',
      '',
      'Thank you! 🙏'
    ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n');

    const waUrl = `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(lines)}`;
    openWhatsApp(waUrl, this.submitBtn);
  }
}
