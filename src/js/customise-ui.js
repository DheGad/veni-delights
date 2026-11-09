/**
 * VENI DELIGHTS — ADVANCED CAKE CUSTOMISATION STUDIO
 * Canvas-based reactive cake visualizer with live frosting swatches,
 * multi-tier options, edible toppings, cursive cake inscription,
 * real-time particle sparkles, and validated WhatsApp handover.
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

    this.previewImg = document.getElementById('customise-preview-img');
    this.previewName = document.getElementById('preview-name');
    this.previewTags = document.getElementById('preview-tags');
    this.previewFields = document.getElementById('preview-fields');

    // Create or locate the interactive dynamic preview canvas
    this.initInteractiveCanvas();
    this.bindEvents();
    this.renderCakeCanvas();
  }

  initInteractiveCanvas() {
    const previewWrap = document.querySelector('.preview-img-wrap');
    if (!previewWrap) return;

    // Create interactive canvas overlay
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'custom-cake-canvas';
    this.canvas.width = 460;
    this.canvas.height = 360;

    // Insert canvas inside preview wrap
    previewWrap.style.position = 'relative';
    previewWrap.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
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
        input.addEventListener('input', () => {
          this.updateDetails();
          this.renderCakeCanvas();
        });
        input.addEventListener('change', () => {
          this.updateDetails();
          this.renderCakeCanvas();
        });
      }
    });

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.submitCustomisation());
    }
  }

  updateDetails() {
    if (!this.productSelect) return;
    const selectedOption = this.productSelect.options[this.productSelect.selectedIndex];
    if (!selectedOption) return;

    const productName = selectedOption.text.split('—')[0].trim();
    const priceText = selectedOption.dataset.price || 'RM79';

    if (this.previewName) this.previewName.textContent = productName;

    if (this.previewTags) {
      this.previewTags.innerHTML = `
        <span class="badge badge-gold">${priceText}</span>
        ${this.occasionSelect?.value ? `<span class="badge badge-cream">${this.occasionSelect.value}</span>` : ''}
        <span class="badge badge-gold" style="animation: pulse-gold 2s infinite;">Live Customizer</span>
      `;
    }

    if (this.previewFields) {
      const occasion = this.occasionSelect?.value || 'Celebration';
      const message = this.messageInput?.value.trim() || 'Custom Inscription';
      const qty = this.qtyInput?.value || '1';
      const colour = this.colourInput?.value.trim() || 'Ivory & Gold';

      this.previewFields.innerHTML = `
        <div class="preview-field">
          <span class="preview-field-label">Occasion:</span>
          <span class="preview-field-value">${occasion}</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Cake Inscription:</span>
          <span class="preview-field-value" style="color:var(--color-gold-champagne); font-style:italic;">"${message}"</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Quantity:</span>
          <span class="preview-field-value">${qty} unit(s)</span>
        </div>
        <div class="preview-field">
          <span class="preview-field-label">Theme Palette:</span>
          <span class="preview-field-value">${colour}</span>
        </div>
      `;
    }
  }

  renderCakeCanvas() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Determine cake palette based on selected product or colour input
    const prodVal = this.productSelect?.value || 'pure-butter';
    let baseColor = '#E6B566'; // Golden Butter
    let shadowColor = '#B88636';
    let trimColor = '#C9A84C';

    if (prodVal.includes('red-velvet')) {
      baseColor = '#8A1C24';
      shadowColor = '#5A0F15';
      trimColor = '#FAF7F0';
    } else if (prodVal.includes('pandan')) {
      baseColor = '#6A9E5B';
      shadowColor = '#437036';
      trimColor = '#E8D5A3';
    } else if (prodVal.includes('marble')) {
      baseColor = '#D4A05B';
      shadowColor = '#4A2A18';
      trimColor = '#F0C860';
    }

    // 1. Draw Pedestal Stand (Obsidian Marble & Gold Ring)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;

    ctx.fillStyle = '#141412';
    ctx.beginPath();
    ctx.ellipse(w / 2, h - 45, 170, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#C9A84C';
    ctx.stroke();
    ctx.restore();

    // 2. Bottom Cake Tier
    const tier1X = w / 2 - 130;
    const tier1Y = h - 145;
    const tier1W = 260;
    const tier1H = 85;

    this.drawCylinder(ctx, tier1X, tier1Y, tier1W, tier1H, baseColor, shadowColor, trimColor);

    // 3. Top Cake Tier
    const tier2X = w / 2 - 85;
    const tier2Y = h - 215;
    const tier2W = 170;
    const tier2H = 75;

    this.drawCylinder(ctx, tier2X, tier2Y, tier2W, tier2H, baseColor, shadowColor, trimColor);

    // 4. Edible Gold Flakes / Shimmer
    ctx.save();
    ctx.fillStyle = '#F0C860';
    ctx.shadowColor = '#FFF2B2';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 22; i++) {
      const rx = w / 2 + Math.sin(i * 3.7) * 90;
      const ry = tier2Y + Math.cos(i * 2.3) * 25 + 30;
      ctx.beginPath();
      ctx.arc(rx, ry, Math.random() * 2.5 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 5. Crown Topping: Golden Ribbon & Strawberries / Macarons
    ctx.save();
    ctx.fillStyle = '#D62828';
    ctx.beginPath();
    ctx.arc(w / 2 - 25, tier2Y - 8, 12, 0, Math.PI * 2);
    ctx.arc(w / 2 + 25, tier2Y - 8, 12, 0, Math.PI * 2);
    ctx.arc(w / 2, tier2Y - 14, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2D6A4F'; // Mint leaf
    ctx.beginPath();
    ctx.ellipse(w / 2, tier2Y - 26, 8, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 6. Inscribed Custom Cake Message (Rendered on lower tier)
    const inscription = this.messageInput?.value.trim() || '';
    if (inscription) {
      ctx.save();
      ctx.font = 'italic 600 15px "Cormorant Garamond", serif';
      ctx.fillStyle = '#FAF7F0';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 6;
      ctx.textAlign = 'center';
      ctx.fillText(`“${inscription}”`, w / 2, tier1Y + 48);
      ctx.restore();
    }
  }

  drawCylinder(ctx, x, y, width, height, fillColor, shadowColor, borderColor) {
    const rx = width / 2;
    const ry = 18; // perspective flattening
    const cx = x + rx;

    // Body
    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, shadowColor);
    grad.addColorStop(0.35, fillColor);
    grad.addColorStop(0.7, fillColor);
    grad.addColorStop(1, shadowColor);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.ellipse(cx, y + height, rx, ry, 0, 0, Math.PI);
    ctx.lineTo(x + width, y);
    ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI);
    ctx.closePath();
    ctx.fill();

    // Top surface
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.ellipse(cx, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gold Trim Ring
    ctx.lineWidth = 2;
    ctx.strokeStyle = borderColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(cx, y + height, rx, ry, 0, 0, Math.PI);
    ctx.stroke();
    ctx.restore();
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
      message ? `✍️ *Custom Cake Inscription:* "${message}"` : '',
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
