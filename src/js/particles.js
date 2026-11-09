/**
 * VENI DELIGHTS — LUXURY GOLD & STRAWBERRY PARTICLES CANVAS
 * High-performance ambient floating motes with:
 * - Ultra-lightweight particle count optimized for mobile speed
 * - Theme-reactive palette (Dark Onyx, White Strawberry, Royal Pandan)
 * - Automatic pause on background tab (0% CPU when not visible)
 */

export class GoldParticleCanvas {
  constructor(canvasId = 'ambient-particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.className = 'ambient-particles-canvas';
      document.body.prepend(this.canvas);
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -1000, y: -1000, radius: 120 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = window.innerWidth < 768;
    this.count = this.isMobile ? 18 : Math.min(Math.floor((this.width * this.height) / 24000), 45);
    this.isPaused = false;
    this.animId = null;

    this.themes = {
      dark: [
        'rgba(201, 168, 76, 0.75)',  // Antique Gold
        'rgba(240, 200, 96, 0.85)',  // Bright Gold
        'rgba(232, 213, 163, 0.65)', // Champagne
        'rgba(250, 247, 240, 0.5)'   // Ivory Mote
      ],
      'white-strawberry': [
        'rgba(214, 51, 108, 0.65)',  // Fresh Strawberry Rose
        'rgba(231, 111, 81, 0.55)',  // Warm Coral
        'rgba(212, 175, 55, 0.6)',   // Champagne Gold
        'rgba(255, 182, 193, 0.7)'   // Soft Strawberry Petal
      ],
      'royal-pandan': [
        'rgba(16, 185, 129, 0.75)',  // Emerald Pandan
        'rgba(52, 211, 153, 0.65)',  // Pandan Suji
        'rgba(212, 175, 55, 0.7)',   // Gula Melaka Gold
        'rgba(240, 253, 244, 0.5)'   // Coconut Cream
      ]
    };

    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    this.colors = this.themes[currentTheme] || this.themes.dark;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.isMobile = this.width < 768;
    this.count = this.isMobile ? 18 : Math.min(Math.floor((this.width * this.height) / 24000), 45);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.5 - 0.15,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.025 + 0.01,
        pulse: Math.random() * Math.PI,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    }, { passive: true });

    if (!this.isMobile) {
      window.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      }, { passive: true });

      window.addEventListener('mouseleave', () => {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      });
    }

    // Power saving: pause on background tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.isPaused = true;
      } else {
        this.isPaused = false;
        this.animate();
      }
    });

    // Theme reaction
    window.addEventListener('veni-theme-change', (e) => {
      const theme = e.detail && e.detail.theme;
      this.colors = this.themes[theme] || this.themes.dark;
      this.particles.forEach(p => {
        p.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      });
    });
  }

  animate() {
    if (this.isPaused) return;

    this.animId = requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      if (!this.isMobile) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }
      }

      const currentAlpha = Math.max(0.12, p.alpha + Math.sin(p.pulse) * 0.25);
      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
