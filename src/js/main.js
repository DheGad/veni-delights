/**
 * VENI DELIGHTS — MASTER JAVASCRIPT ENTRY POINT
 * Bundled via Vite with GSAP, Swiper, and Three.js.
 */

// Import Swiper and styles directly from npm (no external CDN dependency)
import Swiper from 'swiper';
import { Autoplay, EffectFade, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Import GSAP and ScrollTrigger
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Core Modules
import { VeniDigitalHuman } from './avatar3d.js';
import { VeniConcierge } from './concierge.js';
import { OrderDrawer } from './order-drawer.js';
import { ProductsUI } from './products-ui.js';
import { DessertCornerUI } from './dessert-corner-ui.js';
import { CustomiseUI } from './customise-ui.js';
import { GalleryUI } from './gallery-ui.js';
import { ReviewsUI } from './reviews-ui.js';
import { FAQUI } from './faq-ui.js';
import { GoldParticleCanvas } from './particles.js';
import { LuxuryMotionEffects } from './effects.js';
import { DessertShowcase3D } from './showcase3d.js';
import { BakeryWorld3D } from './bakery-world-3d.js';
import { CinematicMediaPlayer } from './cinematic-media.js';
import { LiquidParallaxSystem } from './liquid-parallax.js';
import { ArtisanBakeryExperience } from './artisan-bakery.js';
import { ThemeSwitcher } from './theme-switcher.js';

class VeniDelightsApp {
  constructor() {
    this.init();
  }

  init() {
    // 0. Theme / Color Palette Switcher (Dark Onyx, White Strawberry, Royal Pandan)
    try {
      this.themeSwitcher = new ThemeSwitcher();
    } catch (e) {
      console.warn('Theme switcher init error:', e);
    }

    // 1. Ambient Gold Particle & Sparkle Canvas
    try {
      this.particles = new GoldParticleCanvas();
    } catch (e) {
      console.warn('Particle canvas init error:', e);
    }

    // 2. Luxury Motion & Cursor Effects (3D Card Tilt, Specular Glare, Sound FX)
    try {
      this.effects = new LuxuryMotionEffects();
    } catch (e) {
      console.warn('Luxury effects init error:', e);
    }

    // 2b. Liquid Parallax System & Spatial Strawberry Petals
    try {
      this.liquidParallax = new LiquidParallaxSystem();
    } catch (e) {
      console.warn('Liquid parallax init error:', e);
    }

    // 3. Navigation & Header
    this.initNavbar();
    this.initMobileMenu();

    // 4. Hero Swiper Slideshow
    this.initHeroSwiper();

    // 5. 3D Interactive Dessert Showcase & 360 Turntable
    try {
      if (document.getElementById('hero-3d-stage')) {
        this.showcase3D = new DessertShowcase3D('hero-3d-stage');
      }
    } catch (e) {
      console.warn('3D Showcase init error:', e);
    }

    // 5b. 3D Bakery World & Patisserie Environment
    try {
      if (document.getElementById('bakery-world-stage')) {
        this.bakeryWorld = new BakeryWorld3D('bakery-world-stage');
      }
    } catch (e) {
      console.warn('Bakery world 3D init error:', e);
    }

    // 5c. Cinematic Media Player & Food Cinema
    try {
      this.cinema = new CinematicMediaPlayer('.cinematic-player-wrap');
    } catch (e) {
      console.warn('Cinema player init error:', e);
    }

    // 5d. Artisan Molten Cheese Tarts & Live Bakery Simulation
    try {
      this.artisanBakery = new ArtisanBakeryExperience();
    } catch (e) {
      console.warn('Artisan bakery simulation init error:', e);
    }

    // 6. Commerce & Order Drawer
    this.orderDrawer = new OrderDrawer();

    // 6b. Mobile Sticky Actions Bar
    this.initMobileStickyBar();

    // 7. Products UI (Catalog & Tabs)
    this.productsUI = new ProductsUI(this.orderDrawer);

    // 8. Dessert Corner UI (Packages & Quotation Builder)
    this.dessertCornerUI = new DessertCornerUI();

    // 9. Cake Customisation UI
    this.customiseUI = new CustomiseUI();

    // 10. Gallery UI & Lightbox
    this.galleryUI = new GalleryUI();

    // 11. Reviews UI
    this.reviewsUI = new ReviewsUI();

    // 12. FAQ Accordion
    this.faqUI = new FAQUI();

    // 13. Intelligent Veni Guide Concierge
    this.concierge = new VeniConcierge();

    // 14. 3D Digital Human Avatar (Progressive Enhancement)
    this.initAvatar();

    // 15. Motion Graphics & GSAP Scroll Reveals
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
    try {
      this.heroSwiper = new Swiper('.hero-swiper', {
        modules: [Autoplay, EffectFade],
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 1200,
        loop: true,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false
        },
        allowTouchMove: false
      });
    } catch (e) {
      console.warn('Hero swiper initialization error:', e);
    }
  }

  initAvatar() {
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
    try {
      document.documentElement.classList.add('js-motion');

      const revealElements = document.querySelectorAll('[data-reveal]');
      revealElements.forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => el.classList.add('revealed')
        });

        // If already in viewport on load, reveal immediately
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('revealed');
        }
      });
    } catch (e) {
      console.warn('ScrollTrigger reveal warning:', e);
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('revealed'));
    }
  }

  initMobileStickyBar() {
    const bar = document.getElementById('mobile-sticky-bar');
    if (!bar) return;

    const navTabs = bar.querySelectorAll('a.mobile-bar-btn');
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const href = tab.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          navTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          if (href === '#top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const target = document.querySelector(href);
            if (target) {
              const yOffset = -70;
              const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }
        }
      });
    });

    // Scroll spy to highlight active tab
    const sections = [
      { id: 'top', tabId: 'mob-tab-home', el: document.body },
      { id: 'hero-avatar-card', tabId: 'mob-tab-concierge', el: document.getElementById('hero-avatar-card') },
      { id: 'products', tabId: 'mob-tab-menu', el: document.getElementById('products') },
      { id: 'artisan-showcase', tabId: 'mob-tab-lab', el: document.getElementById('artisan-showcase') }
    ];

    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        scrollTimeout = null;
        const scrollY = window.scrollY;
        if (scrollY < 400) {
          navTabs.forEach(t => t.classList.toggle('active', t.id === 'mob-tab-home'));
          return;
        }

        const midScreen = scrollY + window.innerHeight * 0.35;
        let currentTab = null;

        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = sections[i];
          if (sec.el) {
            const top = sec.el.offsetTop;
            if (midScreen >= top - 100) {
              currentTab = sec.tabId;
              break;
            }
          }
        }

        if (currentTab) {
          navTabs.forEach(t => t.classList.toggle('active', t.id === currentTab));
        }
      }, 100);
    }, { passive: true });

    const mobileCartBtn = document.getElementById('mobile-bar-cart-btn');
    if (mobileCartBtn && this.orderDrawer) {
      mobileCartBtn.addEventListener('click', () => this.orderDrawer.open());
    }

    const mobileThemeBtn = document.getElementById('mobile-bar-theme-toggle');
    if (mobileThemeBtn && this.themeSwitcher) {
      const themes = ['dark', 'white-strawberry', 'royal-pandan'];
      mobileThemeBtn.addEventListener('click', () => {
        const nextIdx = (themes.indexOf(this.themeSwitcher.currentTheme) + 1) % themes.length;
        this.themeSwitcher.applyTheme(themes[nextIdx], true);
      });
    }

    const updateBadge = () => {
      const badge = document.getElementById('mobile-cart-badge');
      if (badge && this.orderDrawer) {
        const count = this.orderDrawer.items ? this.orderDrawer.items.reduce((s, i) => s + (parseInt(i.quantity, 10) || parseInt(i.qty, 10) || 1), 0) : 0;
        badge.textContent = count;
        badge.classList.toggle('has-items', count > 0);
      }
    };
    window.addEventListener('storage', () => {
      if (this.orderDrawer) {
        this.orderDrawer.loadFromStorage();
        this.orderDrawer.render();
      }
      updateBadge();
    });
    window.addEventListener('cart-updated', () => {
      updateBadge();
    });
    updateBadge();
  }
}

// Instantiate on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new VeniDelightsApp());
} else {
  new VeniDelightsApp();
}
