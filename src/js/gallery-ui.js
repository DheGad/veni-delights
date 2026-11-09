/**
 * VENI DELIGHTS — GALLERY UI & LIGHTBOX MODULE
 * Renders all genuine gallery images, handles responsive grid,
 * and provides an accessible fullscreen lightbox with keyboard navigation.
 */

export class GalleryUI {
  constructor() {
    this.gridEl = document.getElementById('gallery-grid');
    this.lightboxEl = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxClose = document.getElementById('lightbox-close');
    this.lightboxPrev = document.getElementById('lightbox-prev');
    this.lightboxNext = document.getElementById('lightbox-next');
    this.lightboxCounter = document.getElementById('lightbox-counter');

    this.images = Array.from({ length: 30 }, (_, i) => ({
      src: `images/gallery/gallery ${i + 1}.jpg`,
      alt: `Veni Delights Handcrafted Bakery & Event Display ${i + 1}`,
      caption: `Sweet Celebration Moment ${i + 1}`
    }));

    this.currentIndex = 0;

    this.init();
  }

  init() {
    this.renderGallery();
    this.bindLightboxEvents();
  }

  renderGallery() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    this.images.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.setAttribute('role', 'listitem');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `View image ${idx + 1} of ${this.images.length}`);
      item.setAttribute('data-reveal', '');

      item.innerHTML = `
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
        <div class="gallery-item-overlay" aria-hidden="true">
          <i class="fa-solid fa-expand"></i>
        </div>
      `;

      item.addEventListener('click', () => this.openLightbox(idx));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(idx);
        }
      });

      this.gridEl.appendChild(item);
    });
  }

  bindLightboxEvents() {
    if (!this.lightboxEl) return;

    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }

    if (this.lightboxPrev) {
      this.lightboxPrev.addEventListener('click', () => this.prevImage());
    }

    if (this.lightboxNext) {
      this.lightboxNext.addEventListener('click', () => this.nextImage());
    }

    // Close when clicking backdrop
    this.lightboxEl.addEventListener('click', (e) => {
      if (e.target === this.lightboxEl) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!this.isLightboxOpen()) return;

      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevImage();
      if (e.key === 'ArrowRight') this.nextImage();
    });
  }

  openLightbox(index) {
    if (!this.lightboxEl) return;
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightboxEl.hidden = false;
    document.body.classList.add('modal-open');
    if (this.lightboxClose) this.lightboxClose.focus();
  }

  closeLightbox() {
    if (!this.lightboxEl) return;
    this.lightboxEl.hidden = true;
    document.body.classList.remove('modal-open');
  }

  isLightboxOpen() {
    return this.lightboxEl && !this.lightboxEl.hidden;
  }

  prevImage() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateLightboxContent();
  }

  nextImage() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateLightboxContent();
  }

  updateLightboxContent() {
    const current = this.images[this.currentIndex];
    if (this.lightboxImg) {
      this.lightboxImg.src = current.src;
      this.lightboxImg.alt = current.alt;
    }
    if (this.lightboxCounter) {
      this.lightboxCounter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
    }
  }
}
