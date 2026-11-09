/**
 * VENI DELIGHTS — CUSTOMER REVIEWS MODULE
 * Renders all 12 genuine review images into a responsive Swiper slider.
 */

export class ReviewsUI {
  constructor() {
    this.wrapperEl = document.getElementById('reviews-wrapper');
    this.reviews = Array.from({ length: 12 }, (_, i) => ({
      src: `images/testimonials/review ${i + 1}.png`,
      alt: `Genuine Customer Review and Feedback ${i + 1} for Veni Delights`,
      id: i + 1
    }));

    this.init();
  }

  init() {
    this.renderReviews();
    this.initSwiper();
  }

  renderReviews() {
    if (!this.wrapperEl) return;
    this.wrapperEl.innerHTML = '';

    this.reviews.forEach(review => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
        <div class="card card-dark" style="padding:var(--space-2); height:100%; display:flex; align-items:center; justify-content:center;">
          <img src="${review.src}" alt="${review.alt}" loading="lazy" style="max-height:480px; width:auto; border-radius:var(--radius-lg);">
        </div>
      `;
      this.wrapperEl.appendChild(slide);
    });
  }

  initSwiper() {
    if (typeof Swiper === 'undefined') return;

    this.swiper = new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: {
        el: '.reviews-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.reviews-next',
        prevEl: '.reviews-prev'
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 24
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 32
        }
      }
    });
  }
}
