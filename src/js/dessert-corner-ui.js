/**
 * VENI DELIGHTS — DESSERT CORNER UI MODULE
 * Renders Dessert Corner packages, add-ons, interactive quotation calculation,
 * and WhatsApp quotation message builder.
 */

import { DESSERT_CORNER } from '../data/products.js';
import { buildDessertCornerURL, openWhatsApp } from './whatsapp.js';

export class DessertCornerUI {
  constructor() {
    this.packagesGrid = document.getElementById('dessert-packages-grid');
    this.addonsGrid = document.getElementById('addons-grid');
    this.enquiryAddonsGrid = document.getElementById('enquiry-addons-grid');
    this.packageSelect = document.getElementById('enquiry-package');
    this.eventTypeSelect = document.getElementById('enquiry-event-type');
    this.eventDateInput = document.getElementById('enquiry-date');
    this.guestCountSelect = document.getElementById('enquiry-guests');
    this.locationInput = document.getElementById('enquiry-location');
    this.nameInput = document.getElementById('enquiry-name');
    this.requirementsInput = document.getElementById('enquiry-requirements');
    this.summaryEl = document.getElementById('enquiry-summary');
    this.submitBtn = document.getElementById('enquiry-submit-btn');

    this.selectedPackageId = null;
    this.selectedAddOnIds = new Set();

    this.init();
  }

  init() {
    this.bindPackageButtons();
    this.bindAddOnCards();
    this.renderEnquiryCheckboxes();
    this.bindEvents();
    this.updateSummary();
  }

  bindPackageButtons() {
    document.querySelectorAll('.pkg-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkgId = btn.dataset.pkgId;
        this.selectPackage(pkgId);
        const formWrap = document.querySelector('.event-enquiry-wrap');
        if (formWrap) formWrap.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  bindAddOnCards() {
    document.querySelectorAll('.addon-card').forEach(card => {
      card.addEventListener('click', () => {
        const addonId = card.dataset.addonId;
        this.toggleAddOn(addonId);
      });
    });
  }

  renderEnquiryCheckboxes() {
    if (!this.enquiryAddonsGrid) return;
    this.enquiryAddonsGrid.innerHTML = '';

    DESSERT_CORNER.addOns.forEach(addon => {
      const label = document.createElement('label');
      label.className = 'enquiry-addon-check';
      label.innerHTML = `
        <input type="checkbox" value="${addon.id}">
        <span>${addon.icon} ${addon.name} (+${addon.priceDisplay})</span>
      `;

      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (input.checked) {
          this.selectedAddOnIds.add(addon.id);
        } else {
          this.selectedAddOnIds.delete(addon.id);
        }
        this.syncAddOnVisuals();
        this.updateSummary();
      });

      this.enquiryAddonsGrid.appendChild(label);
    });
  }

  bindEvents() {
    if (this.packageSelect) {
      this.packageSelect.addEventListener('change', (e) => {
        this.selectedPackageId = e.target.value || null;
        this.updateSummary();
      });
    }

    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', () => this.submitEnquiry());
    }

    // Input listeners to update summary
    [this.eventTypeSelect, this.guestCountSelect, this.eventDateInput].forEach(el => {
      if (el) el.addEventListener('change', () => this.updateSummary());
    });
  }

  selectPackage(pkgId) {
    this.selectedPackageId = pkgId;
    if (this.packageSelect) {
      this.packageSelect.value = pkgId;
    }
    this.updateSummary();
  }

  toggleAddOn(addonId) {
    if (this.selectedAddOnIds.has(addonId)) {
      this.selectedAddOnIds.delete(addonId);
    } else {
      this.selectedAddOnIds.add(addonId);
    }
    this.syncAddOnVisuals();
    this.updateSummary();
  }

  syncAddOnVisuals() {
    // Sync addon cards
    document.querySelectorAll('.addon-card').forEach(card => {
      const id = card.dataset.addonId;
      if (this.selectedAddOnIds.has(id)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });

    // Sync checkboxes
    if (this.enquiryAddonsGrid) {
      this.enquiryAddonsGrid.querySelectorAll('input').forEach(chk => {
        chk.checked = this.selectedAddOnIds.has(chk.value);
      });
    }
  }

  updateSummary() {
    if (!this.summaryEl) return;

    const pkg = DESSERT_CORNER.packages.find(p => p.id === this.selectedPackageId);
    const addOns = Array.from(this.selectedAddOnIds)
      .map(id => DESSERT_CORNER.addOns.find(a => a.id === id))
      .filter(Boolean);

    let subtotal = 0;
    if (pkg) subtotal += pkg.price;
    addOns.forEach(a => { subtotal += a.price; });

    let html = `
      <div class="enquiry-summary-item">
        <span>Selected Package:</span>
        <strong>${pkg ? `${pkg.name} (${pkg.priceDisplay})` : 'None selected'}</strong>
      </div>
      <div class="enquiry-summary-item">
        <span>Add-Ons (${addOns.length}):</span>
        <span>${addOns.length > 0 ? addOns.map(a => a.name).join(', ') : 'None'}</span>
      </div>
    `;

    if (this.eventTypeSelect && this.eventTypeSelect.value) {
      html += `
        <div class="enquiry-summary-item">
          <span>Event Type:</span>
          <span>${this.eventTypeSelect.value}</span>
        </div>
      `;
    }

    html += `
      <div class="enquiry-summary-item" style="font-size:1.15rem; color:var(--color-primary); margin-top:8px;">
        <span>Estimated Package Total:</span>
        <strong style="font-family:var(--font-display); font-size:1.4rem;">
          ${subtotal > 0 ? `RM${subtotal.toFixed(2)}` : 'Select a package'}
        </strong>
      </div>
    `;

    this.summaryEl.innerHTML = html;
  }

  submitEnquiry() {
    const pkg = DESSERT_CORNER.packages.find(p => p.id === this.selectedPackageId);
    const addOns = Array.from(this.selectedAddOnIds)
      .map(id => DESSERT_CORNER.addOns.find(a => a.id === id))
      .filter(Boolean);

    const enquiryData = {
      customerName: this.nameInput?.value.trim() || '',
      selectedPackage: pkg || null,
      addOns: addOns,
      eventType: this.eventTypeSelect?.value || '',
      eventDate: this.eventDateInput?.value || '',
      guestCount: this.guestCountSelect?.value || '',
      eventLocation: this.locationInput?.value.trim() || '',
      specialRequirements: this.requirementsInput?.value.trim() || ''
    };

    const waUrl = buildDessertCornerURL(enquiryData);
    openWhatsApp(waUrl, this.submitBtn);
  }
}
