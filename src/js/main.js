/**
 * VENI DELIGHTS — MASTER JAVASCRIPT ENTRY POINT
 * Coordinates all UI components, GSAP motion design,
 * 3D digital human avatars, concierge, commerce, and event handlers.
 */

import { VeniDigitalHuman } from './avatar3d.js';
import { VeniConcierge } from './concierge.js';
import { OrderDrawer } from './order-drawer.js';
import { ProductsUI } from './products-ui.js';
import { DessertCornerUI } from './dessert-corner-ui.js';
import { CustomiseUI } from './customise-ui.js';
import { GalleryUI } from './gallery-ui.js';
import { ReviewsUI } from './reviews-ui.js';
import { FAQUI } from './faq-ui.js';

class VeniDelightsApp {
  constructor() {
    this.init();
  }

  init() {
    // 1. Navigation & Header
    this.initNavbar();
    this.initMobileMenu();

    // 2. Hero Swiper Slideshow
    this.initHeroSwiper();

    // 3. Commerce & Order Drawer
    this.orderDrawer = new OrderDrawer();

    // 4. Products UI (Catalog & Tabs)
    this.productsUI = new ProductsUI(this.orderDrawer);

    // 5. Dessert Corner UI (Packages & Quotation Builder)
    this.dessertCornerUI = new DessertCornerUI();

    // 6. Cake Customisation UI
    this.customiseUI = new CustomiseUI();

    // 7. Gallery UI & Lightbox
    this.galleryUI = new GalleryUI();

    // 8. Reviews UI
    this.reviewsUI = new ReviewsUI();

    // 9. FAQ Accordion
    this.faqUI = new FAQUI();

    // 10. Intelligent Veni Guide Concierge
    this.concierge = new VeniConcierge();

    // 11. 3D Digital Human Avatar (Progressive Enhancement)
    this.initAvatar();

    // 12. Motion Graphics & GSAP Scroll Reveals
    this.initMotion();
  }

  initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      } else {
        hamburger.classList.add('open');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
      }
    });

    // Close when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  initHeroSwiper() {
    if (typeof Swiper === 'undefined') return;

    this.heroSwiper = new Swiper('.hero-swiper', {
      effect: 'fade',
      fadeEffect: { crossFade: true },
      speed: 1200,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      allowTouchMove: false
    });
  }

  initAvatar() {
    // Check if user prefers reduced motion or is on an ultra-constrained device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      console.log('Reduced motion active: digital human avatar running in low-motion mode.');
    }

    try {
      this.avatar = new VeniDigitalHuman('avatar-container');
    } catch (err) {
      console.warn('Digital human 3D initialization fallback:', err);
    }
  }

  initMotion() {
    // Check for GSAP availability
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (hasGSAP && hasScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Hero Title Stagger Reveal
      gsap.to('.hero-title-line', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.2
      });

      // Scroll Reveal for elements with [data-reveal]
      const revealElements = document.querySelectorAll('[data-reveal]');
      revealElements.forEach(el => {
        const revealType = el.getAttribute('data-reveal');

        let xVal = 0;
        let yVal = 32;

        if (revealType === 'left') { xVal = -40; yVal = 0; }
        if (revealType === 'right') { xVal = 40; yVal = 0; }
        if (revealType === 'fade') { yVal = 0; }

        gsap.fromTo(el,
          { opacity: 0, x: xVal, y: yVal },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        );
      });
    } else {
      // Fallback: Native IntersectionObserver
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('[data-reveal], .hero-title-line').forEach(el => {
        observer.observe(el);
      });
    }
  }
}

// Instantiate on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VeniDelightsApp());
} else {
  new VeniDelightsApp();
}
