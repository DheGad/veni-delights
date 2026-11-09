/**
 * VENI DELIGHTS — LUXURY GOLD PARTICLES & AMBIENT CANVAS
 * High-performance ambient floating gold dust and interactive light motes.
 * Uses requestAnimationFrame, offscreen canvas, and reactive mouse interaction.
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
    this.mouse = { x: -1000, y: -1000, radius: 140 };
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.count = Math.min(Math.floor((this.width * this.height) / 18000), 75);

    this.colors = [
      'rgba(201, 168, 76, 0.75)',  // Antique Gold
      'rgba(240, 200, 96, 0.85)',  // Bright Gold
      'rgba(232, 213, 163, 0.65)', // Champagne
      'rgba(250, 247, 240, 0.5)'   // Ivory Mote
    ];

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
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.45,
        speedY: -Math.random() * 0.6 - 0.2, // Float gently upwards like golden heat/aroma
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.7 + 0.3,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        pulse: Math.random() * Math.PI,
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;

      // Mouse interactive push/glow
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius) {
        const force = (this.mouse.radius - dist) / this.mouse.radius;
        p.x -= (dx / dist) * force * 3;
        p.y -= (dy / dist) * force * 3;
      }

      // Draw particle with gentle pulsing glow
      const currentAlpha = Math.max(0.15, p.alpha + Math.sin(p.pulse) * 0.3);
      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = '#F0C860';
      this.ctx.shadowBlur = p.size * 3;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }
}
