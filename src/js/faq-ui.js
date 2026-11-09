/**
 * VENI DELIGHTS — FAQ MODULE
 * Handles accessible accordion interactions for pre-rendered FAQ items.
 */

export class FAQUI {
  constructor() {
    this.listEl = document.getElementById('faq-list');
    this.init();
  }

  init() {
    this.bindAccordion();
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
