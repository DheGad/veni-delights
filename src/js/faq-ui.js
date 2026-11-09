/**
 * VENI DELIGHTS — FAQ MODULE
 * Renders verified FAQ items with accessible accordion functionality.
 */

import { FAQ } from '../data/products.js';

export class FAQUI {
  constructor() {
    this.listEl = document.getElementById('faq-list');
    this.init();
  }

  init() {
    this.renderFAQ();
    this.bindAccordion();
  }

  renderFAQ() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';

    FAQ.forEach((item, index) => {
      const faqItem = document.createElement('div');
      faqItem.className = 'faq-item';
      faqItem.setAttribute('role', 'listitem');
      faqItem.setAttribute('data-reveal', '');

      faqItem.innerHTML = `
        <button class="faq-question" aria-expanded="false" aria-controls="faq-ans-${index}">
          <span>${item.q}</span>
          <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
        </button>
        <div class="faq-answer" id="faq-ans-${index}" role="region" aria-label="${item.q}">
          <div class="faq-answer-inner">
            <p>${item.a}</p>
          </div>
        </div>
      `;

      this.listEl.appendChild(faqItem);
    });
  }

  bindAccordion() {
    if (!this.listEl) return;

    this.listEl.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close other items (exclusive accordion)
        this.listEl.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            other.classList.remove('open');
            other.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }
}
