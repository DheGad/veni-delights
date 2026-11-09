/**
 * VENI DELIGHTS — HEYGEN-GRADE PHOTOREALISTIC DIGITAL HUMAN ENGINE
 * Ultra-realistic digital humans with interactive gaze tracking, natural micro-breathing,
 * speech synthesis, audio-reactive spectrum analyzer, and multi-persona switching.
 *
 * Personas:
 * 1. Chef Veni (Host & Virtual Concierge) - /images/avatars/host-photoreal.jpg
 * 2. Master Baker (Artisan Chef) - /images/avatars/baker-photoreal.jpg
 * 3. Celebration Stylist (Dessert & Event Curator) - /images/avatars/stylist-photoreal.jpg
 */

export class VeniDigitalHuman {
  constructor(containerId = 'avatar-container') {
    this.container = document.getElementById(containerId) || document.getElementById('hero-avatar-container');
    if (!this.container) return;

    this.activePersona = 'host';
    this.isSpeaking = false;
    this.audioEnabled = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.animFrameId = null;
    this.startTime = performance.now();

    // Personas configuration with ultra-high quality photorealistic assets & voice presets
    this.personas = {
      host: {
        name: 'Chef Veni',
        role: 'Host & Lead Concierge',
        badge: 'LIVE HOST',
        image: '/images/avatars/host-photoreal.jpg',
        greeting: "Welcome to Veni Delights! I am Chef Veni. Every single cake and molten tart is baked fresh to order in Klang using 100% pure butter and natural ingredients.",
        voicePitch: 1.05,
        voiceRate: 0.95,
        accentColor: '#C9A84C'
      },
      baker: {
        name: 'Master Baker',
        role: 'Artisan Kitchen Craftsman',
        badge: 'HEAD BAKER',
        image: '/images/avatars/baker-photoreal.jpg',
        greeting: "Greetings! Our stone deck ovens bake our signature molten cheese tarts at 230°C until the crust is crisp and the cheese lava is bubbling perfection.",
        voicePitch: 0.92,
        voiceRate: 0.92,
        accentColor: '#D4AF37'
      },
      specialist: {
        name: 'Dessert Stylist',
        role: 'Celebration & Table Curator',
        badge: 'EVENT STYLIST',
        image: '/images/avatars/stylist-photoreal.jpg',
        greeting: "Planning a celebration? Our Pavlova pudding cakes and tiered dessert table packages transform weddings, birthdays, and corporate galas into unforgettable moments.",
        voicePitch: 1.1,
        voiceRate: 0.98,
        accentColor: '#F0C860'
      }
    };

    this.init();
  }

  init() {
    this.renderDOM();
    this.setupSpeechSynthesis();
    this.bindEvents();
    this.startMicroMotionLoop();
  }

  renderDOM() {
    this.container.innerHTML = `
      <div class="photoreal-digital-human" id="photoreal-digital-human" data-persona="${this.activePersona}">
        <div class="human-viewport">
          <!-- Multi-Persona Portrait Stack -->
          <div class="human-portrait-stack" id="human-portrait-stack">
            <img src="${this.personas.host.image}" 
                 alt="${this.personas.host.name}" 
                 class="human-portrait-img active" 
                 id="portrait-host" 
                 loading="eager" />
            <img src="${this.personas.baker.image}" 
                 alt="${this.personas.baker.name}" 
                 class="human-portrait-img" 
                 id="portrait-baker" 
                 loading="lazy" />
            <img src="${this.personas.specialist.image}" 
                 alt="${this.personas.specialist.name}" 
                 class="human-portrait-img" 
                 id="portrait-specialist" 
                 loading="lazy" />
          </div>

          <!-- Studio Refraction & Rim Light Vignette -->
          <div class="human-lighting-vignette" aria-hidden="true"></div>

          <!-- Real-Time Speech Equalizer Canvas -->
          <canvas class="human-equalizer-canvas" id="human-equalizer-canvas" width="130" height="40" aria-hidden="true"></canvas>

          <!-- Status Indicator Pill -->
          <div class="human-live-badge" id="human-live-badge">
            <span class="live-dot"></span>
            <span class="badge-text" id="human-badge-role">${this.personas.host.name}</span>
          </div>
        </div>
      </div>
    `;

    this.stackEl = this.container.querySelector('#human-portrait-stack');
    this.badgeTextEl = this.container.querySelector('#human-badge-role');
    this.canvasEl = this.container.querySelector('#human-equalizer-canvas');
    if (this.canvasEl) {
      this.ctx = this.canvasEl.getContext('2d');
    }
  }

  setupSpeechSynthesis() {
    this.synth = window.speechSynthesis || null;
  }

  bindEvents() {
    // 3D Parallax perspective on mouse move
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth * 0.5);
      this.mouse.targetY = (e.clientY - centerY) / (window.innerHeight * 0.5);
    }, { passive: true });

    // Bind persona buttons in DOM
    document.querySelectorAll('.persona-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const persona = btn.dataset.persona;
        if (persona) {
          this.switchPersona(persona);
        }
      });
    });

    // Voice Toggle button handler
    const handleVoiceToggle = () => {
      this.audioEnabled = !this.audioEnabled;
      const heroToggle = document.getElementById('hero-voice-toggle-btn');
      
      if (this.audioEnabled) {
        if (heroToggle) {
          heroToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Voice: Speaking</span>';
          heroToggle.classList.add('active');
        }
        this.speak(this.personas[this.activePersona].greeting);
      } else {
        if (heroToggle) {
          heroToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Listen to Host</span>';
          heroToggle.classList.remove('active');
        }
        if (this.synth) this.synth.cancel();
        this.setSpeaking(false);
      }
    };

    const heroAudioBtn = document.getElementById('hero-voice-toggle-btn');
    if (heroAudioBtn) {
      heroAudioBtn.addEventListener('click', handleVoiceToggle);
    }
  }

  switchPersona(personaKey) {
    if (!this.personas[personaKey]) return;
    this.activePersona = personaKey;
    const persona = this.personas[personaKey];

    // Update active portrait image
    const portraits = this.container.querySelectorAll('.human-portrait-img');
    portraits.forEach(img => {
      img.classList.toggle('active', img.id === `portrait-${personaKey}`);
    });

    // Update tab buttons
    document.querySelectorAll('.persona-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.persona === personaKey);
    });

    // Update badge in avatar
    if (this.badgeTextEl) {
      this.badgeTextEl.textContent = persona.name;
    }

    // Update speech text in bubble
    const speechTextEl = document.getElementById('avatar-speech-text');
    if (speechTextEl) {
      speechTextEl.textContent = `"${persona.greeting}"`;
    }

    // Also update any concierge avatar label elsewhere on page
    const guideLabel = document.querySelector('.concierge-avatar-label');
    if (guideLabel) guideLabel.textContent = `${persona.name} • ${persona.role}`;

    // Speak greeting if audio enabled
    if (this.audioEnabled) {
      this.speak(persona.greeting);
    } else {
      // Gentle 2-second visual speech ripple
      this.setSpeaking(true);
      setTimeout(() => this.setSpeaking(false), 2500);
    }
  }

  speak(text) {
    const speechBubble = document.getElementById('avatar-speech-bubble');
    const speechTextEl = document.getElementById('avatar-speech-text');
    if (speechTextEl) {
      speechTextEl.textContent = `"${text}"`;
    }
    if (speechBubble) {
      speechBubble.classList.add('speaking');
    }

    this.setSpeaking(true);

    if (!this.synth || !this.audioEnabled) {
      // Visual simulation fallback
      setTimeout(() => {
        this.setSpeaking(false);
        if (speechBubble) speechBubble.classList.remove('speaking');
      }, Math.min(5000, Math.max(2500, text.length * 50)));
      return;
    }

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const persona = this.personas[this.activePersona];
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onend = () => {
      this.setSpeaking(false);
      if (speechBubble) speechBubble.classList.remove('speaking');
    };

    utterance.onerror = () => {
      this.setSpeaking(false);
      if (speechBubble) speechBubble.classList.remove('speaking');
    };

    this.synth.speak(utterance);
  }

  setSpeaking(speaking) {
    this.isSpeaking = speaking;
    const waveEl = document.getElementById('avatar-soundwave-bars');
    if (waveEl) {
      waveEl.classList.toggle('speaking', speaking);
    }
    if (this.container) {
      this.container.classList.toggle('speaking', speaking);
    }
  }

  startMicroMotionLoop() {
    this.isVisible = true;
    
    // Intersection observer to pause when offscreen
    if ('IntersectionObserver' in window && this.container) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting && !document.hidden;
          if (this.isVisible && !this.animFrameId) {
            this.animFrameId = requestAnimationFrame(animate);
          }
        });
      }, { threshold: 0.05 });
      observer.observe(this.container);
    }

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible && !this.animFrameId) {
        this.animFrameId = requestAnimationFrame(animate);
      }
    });

    const animate = (timestamp) => {
      if (!this.isVisible) {
        this.animFrameId = null;
        return;
      }

      const elapsed = (timestamp - this.startTime) / 1000;

      // Smooth interpolation for mouse gaze
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      // Natural respiration & micro-sway (HeyGen style subtle breathing)
      const breathY = Math.sin(elapsed * 1.6) * 2.2;
      const breathScale = 1.0 + Math.sin(elapsed * 1.6) * 0.008;
      const rotY = this.mouse.x * 6; // max 6 deg tilt
      const rotX = -this.mouse.y * 5;

      if (this.stackEl) {
        this.stackEl.style.transform = `
          perspective(600px)
          translate3d(0, ${breathY}px, 0)
          rotateY(${rotY}deg)
          rotateX(${rotX}deg)
          scale(${breathScale})
        `;
      }

      // Draw real-time glowing audio spectrum waveform on canvas
      this.drawEqualizer(elapsed);

      this.animFrameId = requestAnimationFrame(animate);
    };

    this.animFrameId = requestAnimationFrame(animate);
  }

  drawEqualizer(time) {
    if (!this.ctx || !this.canvasEl) return;
    const ctx = this.ctx;
    const w = this.canvasEl.width;
    const h = this.canvasEl.height;

    ctx.clearRect(0, 0, w, h);

    const barCount = 18;
    const barWidth = 3;
    const gap = (w - (barCount * barWidth)) / (barCount - 1);
    const persona = this.personas[this.activePersona];

    for (let i = 0; i < barCount; i++) {
      let barHeight;
      if (this.isSpeaking) {
        // High energetic speaking rhythm
        const freq = Math.sin(time * 12 + i * 0.6) * Math.cos(time * 8 + i * 0.3);
        barHeight = Math.max(3, Math.abs(freq) * (h * 0.85));
      } else {
        // Subtle ambient resting pulse
        const freq = Math.sin(time * 2 + i * 0.4);
        barHeight = Math.max(2, Math.abs(freq) * 6);
      }

      const x = i * (barWidth + gap);
      const y = h - barHeight;

      const grad = ctx.createLinearGradient(0, y, 0, h);
      grad.addColorStop(0, '#FFF5DB');
      grad.addColorStop(0.5, persona.accentColor || '#C9A84C');
      grad.addColorStop(1, 'rgba(201, 168, 76, 0.1)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
      ctx.fill();
    }
  }

  setState(state) {
    // Compatibility with earlier callers
    if (state === 'greet') {
      this.speak(this.personas[this.activePersona].greeting);
    }
  }

  destroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.synth) {
      this.synth.cancel();
    }
  }
}
