/**
 * VENI DELIGHTS — GALLERY UI & LIGHTBOX MODULE
 * Manages responsive gallery interactions and accessible fullscreen lightbox with keyboard navigation.
 */

export class GalleryUI {
  constructor() {
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
    this.bindGalleryItems();
    this.bindLightboxEvents();
  }

  bindGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(item => {
      const idx = parseInt(item.dataset.index, 10);
      item.addEventListener('click', () => this.openLightbox(idx));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(idx);
        }
      });
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
    this.currentIndex = isNaN(index) ? 0 : index;
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
