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
    customerPhone = order.phone || order.customerPhone || '',
    preferredDate = order.date || order.preferredDate || '',
    deliveryPreference = order.delivery || order.deliveryPreference || '',
    deliveryAddress = order.address || order.deliveryAddress || '',
    specialInstructions = order.instructions || order.notes || order.specialInstructions || '',
    items = [],
  } = order;

  if (!items.length) return null;

  let totalRM = 0;
  let hasEnquiry = false;

  const itemLines = items.map((item, idx) => {
    let line = `${idx + 1}. *${item.name}*`;
    if (item.variant) line += ` (${item.variant})`;
    const qty = parseInt(item.quantity || item.qty || 1, 10);
    line += `\n   Qty: ${qty}`;
    if (typeof item.price === 'number' && item.price > 0) {
      const itemSub = item.price * qty;
      totalRM += itemSub;
      line += ` × RM${item.price.toFixed(2)} = *RM${itemSub.toFixed(2)}*`;
    } else if (item.priceDisplay) {
      line += ` — ${item.priceDisplay}`;
      hasEnquiry = true;
    } else {
      line += ` — (Price on enquiry)`;
      hasEnquiry = true;
    }
    if (item.customisation) line += `\n   Note: ${item.customisation}`;
    return line;
  }).join('\n\n');

  const totalStr = totalRM > 0 ? `RM${totalRM.toFixed(2)}${hasEnquiry ? ' (+ enquiry items)' : ''}` : 'Confirmed on enquiry';

  const message = [
    '🎂 *NEW ORDER — VENI DELIGHTS (Klang)*',
    '─────────────────────────',
    customerName ? `👤 *Customer Name:* ${customerName}` : '',
    customerPhone ? `📱 *Phone / WhatsApp:* ${customerPhone}` : '',
    preferredDate ? `📅 *Preferred Date:* ${preferredDate}` : '',
    deliveryPreference ? `🚚 *Collection / Delivery:* ${deliveryPreference}` : '',
    deliveryAddress ? `📍 *Delivery Address:* ${deliveryAddress}` : '',
    specialInstructions ? `📝 *Special Inscription / Notes:* ${specialInstructions}` : '',
    '─────────────────────────',
    '📦 *ORDERED CREATIONS:*',
    itemLines,
    '─────────────────────────',
    `💰 *ESTIMATED SUBTOTAL:* *${totalStr}*`,
    '_*(Delivery fee calculated by distance upon confirmation)*_',
    '',
    'Please confirm availability and banking/DuitNow payment details. Thank you! 🙏',
  ].filter(line => line !== null && line !== undefined && line !== '').join('\n').replace(/\n{3,}/g, '\n\n');

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
 * Open WhatsApp URL immediately and synchronously.
 * On mobile devices, window.location.href triggers native WhatsApp app without popup blockers.
 * On desktop, window.open is used with fallback to window.location.href.
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
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 3000);
  }

  // DIRECT SYNCHRONOUS NAVIGATION (no setTimeout delay to avoid popup blockers)
  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = url;
  } else {
    try {
      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (e) {
      window.location.href = url;
    }
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
