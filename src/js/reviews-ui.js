/**
 * VENI DELIGHTS — CUSTOMER REVIEWS MODULE
 * Initializes the responsive Swiper slider for pre-rendered customer reviews.
 */

import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

export class ReviewsUI {
  constructor() {
    this.init();
  }

  init() {
    this.initSwiper();
  }

  initSwiper() {
    try {
      this.swiper = new Swiper('.reviews-swiper', {
        modules: [Autoplay, Pagination, Navigation],
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
    } catch (e) {
      console.warn('Reviews swiper init error:', e);
    }
  }
}
