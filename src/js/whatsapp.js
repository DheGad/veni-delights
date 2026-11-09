/**
 * VENI DELIGHTS — WHATSAPP ORDERING ENGINE
 * Central WhatsApp integration module.
 * All order messages route through this module to ensure correctness.
 */

import { BUSINESS } from '../data/products.js';

const WA_BASE = `https://wa.me/${BUSINESS.whatsapp}?text=`;

/**
 * Encode message for WhatsApp URL
 */
function encodeWA(message) {
  return WA_BASE + encodeURIComponent(message.trim());
}

/**
 * Build a product order WhatsApp message
 * @param {Object} order - Order details
 * @returns {string} WhatsApp URL
 */
export function buildProductOrderURL(order) {
  const {
    customerName = '',
    items = [],
    specialInstructions = '',
    preferredDate = '',
    deliveryPreference = '',
  } = order;

  if (!items.length) return null;

  const itemLines = items.map(item => {
    let line = `• ${item.name}`;
    if (item.variant) line += ` — ${item.variant}`;
    if (item.quantity > 1) line += ` × ${item.quantity}`;
    if (item.customisation) line += `\n  Customisation: ${item.customisation}`;
    return line;
  }).join('\n');

  const message = [
    'Hello Veni Delights! 👋',
    '',
    "I would like to place an order.",
    '',
    '📦 *Products:*',
    itemLines,
    '',
    customerName ? `👤 *Customer Name:* ${customerName}` : '',
    preferredDate ? `📅 *Preferred Date:* ${preferredDate}` : '',
    deliveryPreference ? `🚚 *Pickup / Delivery:* ${deliveryPreference}` : '',
    specialInstructions ? `📝 *Special Instructions:* ${specialInstructions}` : '',
    '',
    'Please confirm availability and final pricing.',
    '',
    'Thank you! 🙏',
  ].filter(line => line !== null && line !== undefined).join('\n').replace(/\n{3,}/g, '\n\n');

  return encodeWA(message);
}

/**
 * Build a Dessert Corner enquiry WhatsApp message
 * @param {Object} enquiry - Enquiry details
 * @returns {string} WhatsApp URL
 */
export function buildDessertCornerURL(enquiry) {
  const {
    customerName = '',
    selectedPackage = null,
    addOns = [],
    eventType = '',
    eventDate = '',
    guestCount = '',
    eventLocation = '',
    specialRequirements = '',
  } = enquiry;

  const packageLine = selectedPackage
    ? `${selectedPackage.name} (${selectedPackage.priceDisplay})`
    : 'Not selected yet';

  const addOnLines = addOns.length > 0
    ? addOns.map(a => `  • ${a.name} (${a.priceDisplay})`).join('\n')
    : '  None';

  const message = [
    'Hello Veni Delights! 👋',
    '',
    'I would like to enquire about a *Dessert Corner* package.',
    '',
    `🎁 *Selected Package:* ${packageLine}`,
    '',
    `➕ *Add-Ons:*\n${addOnLines}`,
    '',
    eventType ? `🎉 *Event Type:* ${eventType}` : '',
    eventDate ? `📅 *Event Date:* ${eventDate}` : '',
    guestCount ? `👥 *Estimated Guests:* ${guestCount}` : '',
    eventLocation ? `📍 *Event Location:* ${eventLocation}` : '',
    customerName ? `👤 *Customer Name:* ${customerName}` : '',
    specialRequirements ? `📝 *Special Requirements:* ${specialRequirements}` : '',
    '',
    'Please confirm availability and provide a quotation.',
    '',
    'Thank you! 🙏',
  ].filter(Boolean).join('\n').replace(/\n{3,}/g, '\n\n');

  return encodeWA(message);
}

/**
 * Build a simple single-product WhatsApp URL from product data
 * @param {string} productWhatsappText - Pre-built text from product data
 * @returns {string} WhatsApp URL
 */
export function buildSimpleOrderURL(productWhatsappText) {
  if (!productWhatsappText) return `https://wa.me/${BUSINESS.whatsapp}`;
  return encodeWA(productWhatsappText);
}

/**
 * Build a general enquiry URL
 */
export function buildGeneralEnquiryURL(subject = '') {
  const message = subject
    ? `Hello Veni Delights! I'd like to enquire about ${subject}. Please advise.`
    : "Hello Veni Delights! I'd like to place an order. Please assist me.";
  return encodeWA(message);
}

/**
 * Open WhatsApp URL after optional confirmation
 * Shows a brief confirmation state before opening.
 * @param {string} url - WhatsApp URL
 * @param {HTMLElement} btn - Button element for state management
 */
export function openWhatsApp(url, btn = null) {
  if (!url) return;

  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Opening WhatsApp...';
    btn.disabled = true;
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }, 2000);
    }, 300);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Validate order items before building URL
 * @param {Array} items
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateOrder(items) {
  const errors = [];

  if (!items || !items.length) {
    errors.push('No items in order.');
    return { valid: false, errors };
  }

  items.forEach((item, index) => {
    if (!item.name) {
      errors.push(`Item ${index + 1}: Missing product name.`);
    }
    if (item.quantity && (isNaN(item.quantity) || item.quantity < 1)) {
      errors.push(`Item ${index + 1}: Invalid quantity.`);
    }
    if (item.minimumOrder && item.quantity < item.minimumOrder) {
      errors.push(`Item ${index + 1}: Minimum order is ${item.minimumOrder} pieces.`);
    }
  });

  return { valid: errors.length === 0, errors };
}
