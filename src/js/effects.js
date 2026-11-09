/**
 * VENI DELIGHTS — LUXURY MOTION & MICRO-INTERACTION EFFECTS
 * 1. Fluid Custom Gold Cursor with Trail & Magnetic Snapping
 * 2. 3D Perspective Card Tilt with Holographic Specular Glare
 * 3. Web Audio Micro-Chimes & Visualizer Waves
 */

export class LuxuryMotionEffects {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.init();
  }

  init() {
    if (!this.isTouch) {
      this.initCustomCursor();
      this.init3DCardTilt();
    }
    this.initSoundFX();
  }

  /* ─────────────────────────────────────────────────────────────
   * 1. FLUID CUSTOM GOLD CURSOR
   * ───────────────────────────────────────────────────────────── */
  initCustomCursor() {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'luxury-cursor-dot';
    document.body.appendChild(cursorDot);

    const cursorRing = document.createElement('div');
    cursorRing.className = 'luxury-cursor-ring';
    document.body.appendChild(cursorRing);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth RAF loop for the lagging trailing ring
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Hover state expansion over interactive targets
    const interactiveSelectors = 'a, button, input, select, textarea, .product-card, .collection-card, .addon-card, .persona-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorRing.classList.add('cursor-hover');
        cursorDot.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        cursorRing.classList.remove('cursor-hover');
        cursorDot.classList.remove('cursor-hover');
      }
    });

    document.addEventListener('mousedown', () => {
      cursorRing.classList.add('cursor-click');
    });

    document.addEventListener('mouseup', () => {
      cursorRing.classList.remove('cursor-click');
    });
  }

  /* ─────────────────────────────────────────────────────────────
   * 2. 3D CARD PERSPECTIVE TILT & DYNAMIC SPECULAR GLARE
   * ───────────────────────────────────────────────────────────── */
  init3DCardTilt() {
    const cards = document.querySelectorAll('.product-card, .collection-card, .dessert-package-card, .why-card');

    cards.forEach(card => {
      // Add specular glare overlay
      let glare = card.querySelector('.card-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element
        const y = e.clientY - rect.top;  // y position within element

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8; // max 8deg tilt
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;

        // Update glare position
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 230, 160, 0.22) 0%, rgba(201, 168, 76, 0.05) 40%, transparent 70%)`;
        glare.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        glare.style.opacity = '0';
      });
    });
  }

  /* ─────────────────────────────────────────────────────────────
   * 3. WEB AUDIO BOUTIQUE SOUND FX
   * ───────────────────────────────────────────────────────────── */
  initSoundFX() {
    let audioCtx = null;

    const getAudioCtx = () => {
      if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      return audioCtx;
    };

    // Play subtle crystalline bell chime on primary actions
    this.playChime = (freq = 880, duration = 0.35) => {
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + duration * 0.3);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch (e) {
        // Audio suspended or blocked
      }
    };

    // Attach subtle feedback sound to primary buttons
    document.querySelectorAll('.btn-primary, .concierge-choice-btn, .persona-btn, .add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        this.playChime(659.25, 0.25); // Musical E5 note
      });
    });
  }
}
