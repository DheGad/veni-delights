/**
 * VENI DELIGHTS — LIQUID MOTION, SPATIAL PARALLAX & STRAWBERRY PARTICLES
 * Features:
 * - Fluid spatial parallax on mouse move (floating strawberry petals, cream orbs, gold dust)
 * - Liquid SVG distortion ripple effect on buttons and cards
 * - Luxury dual-ring gold & strawberry cursor with particle trails
 * - Accessibility: prefers-reduced-motion safe
 */

export class LiquidParallaxSystem {
  constructor() {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    if (this.prefersReducedMotion) {
      console.log('Reduced motion active: liquid parallax running in static accessible mode.');
      return;
    }

    this.initLiquidFilter();
    this.initSpatialParallax();
    this.initLuxuryCursor();
  }

  initLiquidFilter() {
    // Inject SVG displacement filter into document for liquid button/card ripples
    if (document.getElementById('liquid-svg-filter')) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'liquid-svg-filter';
    svg.style.position = 'absolute';
    svg.style.width = '0';
    svg.style.height = '0';
    svg.style.pointerEvents = 'none';
    svg.innerHTML = `
      <defs>
        <filter id="liquidRipple" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.02" numOctaves="3" result="noise" seed="5">
            <animate attributeName="baseFrequency" dur="10s" values="0.015 0.02;0.025 0.04;0.015 0.02" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    `;
    document.body.appendChild(svg);
  }

  initSpatialParallax() {
    // Create floating strawberry slices and vanilla cream orbs
    const container = document.createElement('div');
    container.className = 'spatial-parallax-container';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = `
      <div class="parallax-layer layer-far" data-depth="0.08">
        <span class="p-orb orb-1"></span>
        <span class="p-orb orb-2"></span>
      </div>
      <div class="parallax-layer layer-mid" data-depth="0.18">
        <span class="p-petal petal-1">🍓</span>
        <span class="p-sparkle sp-1">✨</span>
        <span class="p-petal petal-2">🌸</span>
      </div>
      <div class="parallax-layer layer-near" data-depth="0.32">
        <span class="p-sparkle sp-2">✨</span>
        <span class="p-petal petal-3">🍓</span>
      </div>
    `;
    document.body.appendChild(container);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - window.innerWidth / 2);
      targetY = (e.clientY - window.innerHeight / 2);
    });

    const updateParallax = () => {
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      const layers = container.querySelectorAll('.parallax-layer');
      layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth) || 0.1;
        const x = -(mouseX * depth);
        const y = -(mouseY * depth);
        layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      requestAnimationFrame(updateParallax);
    };

    updateParallax();
  }

  initLuxuryCursor() {
    // Only on fine-pointer devices (laptops/desktops)
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'luxury-cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'luxury-cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let ringX = cursorX;
    let ringY = cursorY;

    window.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      dot.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    });

    const renderCursorRing = () => {
      ringX += (cursorX - ringX) * 0.18;
      ringY += (cursorY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursorRing);
    };
    renderCursorRing();

    // Hover interactive expansion
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .product-card, .cake-dock-btn');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('cursor-hover'));
    });

    window.addEventListener('mousedown', () => ring.classList.add('cursor-click'));
    window.addEventListener('mouseup', () => ring.classList.remove('cursor-click'));
  }
}
