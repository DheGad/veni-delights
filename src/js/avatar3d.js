/**
 * VENI DELIGHTS — HEYGEN-GRADE PHOTOREALISTIC DIGITAL HUMAN & AI VOICE CONCIERGE
 * Ultra-realistic digital humans with interactive gaze tracking, natural micro-breathing,
 * Web Speech API AI voice engine, audio-reactive spectrum analyzer, multi-persona switching,
 * and interactive pre-filled Q&A knowledge matrix.
 *
 * Personas:
 * 1. Chef Veni (Host & Lead Concierge) - /images/avatars/host-photoreal.jpg
 * 2. Master Baker (Artisan Kitchen Craftsman) - /images/avatars/baker-photoreal.jpg
 * 3. Dessert Stylist (Celebration & Table Curator) - /images/avatars/stylist-photoreal.jpg
 */

export const CONCIERGE_QA_MATRIX = [
  {
    id: 'butter',
    icon: '🧈',
    short: '100% Pure Butter?',
    question: 'Do you really use 100% pure butter in all cakes?',
    answer: 'Absolutely yes! We never use margarine or shortening. Every butter cake, tart crust, and brownie is baked with 100% pure European dairy butter for authentic melt-in-the-mouth richness.',
    persona: 'host',
    waText: 'Hi Chef Veni! I would like to order your 100% Pure Butter Cake (RM79).'
  },
  {
    id: 'bestseller',
    icon: '🎂',
    short: 'Best Birthday Cake?',
    question: 'Which cake is best for a birthday celebration?',
    answer: 'Our #1 best-seller is the Pure Butter Cake (RM79) — fluffy golden crumb crowned with salted caramel and fresh strawberries. For fruit lovers, our Pavlova Pudding Cake (RM88) is breathtaking!',
    persona: 'host',
    waText: 'Hi Chef Veni! I would like to order your best-selling birthday cake for our celebration.'
  },
  {
    id: 'delivery',
    icon: '🚚',
    short: 'Klang & PJ Delivery?',
    question: 'Do you deliver to Klang, PJ, Subang, and KL?',
    answer: 'Yes! We deliver fresh daily across Klang, Shah Alam, Subang, Petaling Jaya, and Greater KL. All cakes are packed in insulated boxes and transported carefully to arrive in pristine condition.',
    persona: 'host',
    waText: 'Hi Chef Veni! Can you check delivery availability and fees to my location?'
  },
  {
    id: 'tarts',
    icon: '🧀',
    short: 'How to Reheat Tarts?',
    question: 'How should I reheat the Molten Cheese Tarts for maximum lava flow?',
    answer: 'For that irresistible molten lava rush: pop them in a preheated oven or air fryer at 180°C for 4 to 5 minutes. The crust crisps up and the warm cream cheese oozes luxuriously!',
    persona: 'baker',
    waText: 'Hi Master Baker! I would like to order fresh Molten Cheese Tarts (minimum 10 pcs).'
  },
  {
    id: 'pandan',
    icon: '🌿',
    short: 'Real Pandan Leaves?',
    question: 'Is the Pandan Layer cake made from real pandan leaves?',
    answer: '100% pure pandan extract! We hand-press fresh fragrant Pandan Suji leaves daily with rich coconut milk and natural agar-agar. Zero artificial green food dye, guaranteed.',
    persona: 'baker',
    waText: 'Hi Master Baker! I would like to order the authentic 100% Natural Pandan Layer Cake.'
  },
  {
    id: 'custom',
    icon: '✍️',
    short: 'Custom Inscriptions?',
    question: 'Can I add a custom chocolate message or birthday toppers?',
    answer: 'Yes! We offer complimentary custom chocolate plaque inscriptions, birthday candles, and luxury cake knives with every whole cake order. Just let us know your message on WhatsApp!',
    persona: 'specialist',
    waText: 'Hi Dessert Stylist! I would like to personalise a celebration cake with a custom message.'
  }
];

export class VeniDigitalHuman {
  constructor(containerId = 'avatar-container') {
    this.container = document.getElementById(containerId) || document.getElementById('hero-avatar-container');
    if (!this.container) return;

    this.activePersona = 'host';
    this.activeQAId = null;
    this.isSpeaking = false;
    this.audioEnabled = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.animFrameId = null;
    this.startTime = performance.now();
    this.availableVoices = [];

    // Personas configuration with ultra-high quality photorealistic assets & voice presets
    this.personas = {
      host: {
        name: 'Chef Veni',
        role: 'Host & Lead Concierge',
        badge: 'LIVE HOST',
        image: '/images/avatars/host-photoreal.jpg',
        greeting: "Welcome to Veni Delights! I am Chef Veni. Every single cake and molten tart is baked fresh to order in Klang using 100% pure butter and natural ingredients.",
        voicePitch: 1.05,
        voiceRate: 0.96,
        accentColor: '#C9A84C'
      },
      baker: {
        name: 'Master Baker',
        role: 'Artisan Kitchen Craftsman',
        badge: 'HEAD BAKER',
        image: '/images/avatars/baker-photoreal.jpg',
        greeting: "Greetings! Our stone deck ovens bake our signature molten cheese tarts at 230°C until the crust is crisp and the cheese lava is bubbling perfection.",
        voicePitch: 0.92,
        voiceRate: 0.93,
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
    this.renderQAMatrix();
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
    if (this.synth) {
      const updateVoices = () => {
        try {
          this.availableVoices = this.synth.getVoices();
        } catch (e) {
          this.availableVoices = [];
        }
      };
      updateVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  getBestVoice(personaKey) {
    if (!this.availableVoices || this.availableVoices.length === 0) return null;

    const langPriority = ['en-GB', 'en-US', 'en-AU', 'en-CA', 'en'];

    if (personaKey === 'host') {
      // Prefer clear natural female English voice
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Victoria') || v.name.includes('Karen') || v.name.includes('Serena')) &&
        v.lang.startsWith('en')
      );
      if (preferred) return preferred;
    } else if (personaKey === 'baker') {
      // Prefer deeper or male English voice
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Oliver') || v.name.includes('Guy') || v.name.includes('Male')) &&
        v.lang.startsWith('en')
      );
      if (preferred) return preferred;
    } else if (personaKey === 'specialist') {
      // Prefer cheerful / stylish female English voice
      const preferred = this.availableVoices.find(v => 
        (v.name.includes('Moira') || v.name.includes('Tessa') || v.name.includes('Fiona') || v.name.includes('Zira')) &&
        v.lang.startsWith('en')
      );
      if (preferred) return preferred;
    }

    // Fallback: any English voice
    return this.availableVoices.find(v => v.lang.startsWith('en')) || this.availableVoices[0];
  }

  renderQAMatrix() {
    const parent = document.getElementById('hero-avatar-card');
    if (!parent) return;

    let row = parent.querySelector('.avatar-qa-chips-row');
    if (!row) {
      row = document.createElement('div');
      row.className = 'avatar-qa-chips-row';
      row.setAttribute('role', 'region');
      row.setAttribute('aria-label', 'Ask Chef Veni pre-filled questions');

      const dialogCol = parent.querySelector('.avatar-dialog-column');
      if (dialogCol) {
        dialogCol.appendChild(row);
      } else {
        parent.appendChild(row);
      }
    }

    row.innerHTML = `
      <div class="qa-chips-scroll" role="tablist" aria-label="Pre-filled bakery questions">
        ${CONCIERGE_QA_MATRIX.map(item => `
          <button class="qa-chip-btn ${this.activeQAId === item.id ? 'active' : ''}" 
                  data-qa-id="${item.id}" 
                  type="button"
                  title="${item.question}">
            <span class="qa-chip-icon">${item.icon}</span>
            <span class="qa-chip-label">${item.short}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Bind click events on chips
    row.querySelectorAll('.qa-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.qaId;
        const item = CONCIERGE_QA_MATRIX.find(q => q.id === id);
        if (item) {
          this.askQuestion(item);
        }
      });
    });
  }

  askQuestion(qaItem) {
    this.activeQAId = qaItem.id;

    // Switch persona if needed (e.g. baker for cheese tart and pandan)
    if (qaItem.persona && this.personas[qaItem.persona]) {
      this.switchPersona(qaItem.persona, false);
    }

    // Update active chip styling
    const chips = document.querySelectorAll('.qa-chip-btn');
    chips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.qaId === qaItem.id);
    });

    // Animate speech text reveal
    const speechTextEl = document.getElementById('avatar-speech-text');
    if (speechTextEl) {
      speechTextEl.style.opacity = '0';
      speechTextEl.style.transform = 'translateY(4px)';
      setTimeout(() => {
        speechTextEl.textContent = `"${qaItem.answer}"`;
        speechTextEl.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        speechTextEl.style.opacity = '1';
        speechTextEl.style.transform = 'translateY(0)';
      }, 120);
    }

    // Update WhatsApp inquiry link
    const waLink = document.getElementById('avatar-qa-wa-link');
    if (waLink) {
      waLink.href = `https://wa.me/60123360470?text=${encodeURIComponent(qaItem.waText)}`;
      waLink.innerHTML = `<i class="fa-brands fa-whatsapp"></i> <span>Order on WhatsApp</span>`;
      waLink.style.display = 'inline-flex';
    }

    // Enable voice playback and speak response
    this.audioEnabled = true;
    const heroToggle = document.getElementById('hero-voice-toggle-btn');
    if (heroToggle) {
      heroToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Voice: Speaking</span>';
      heroToggle.classList.add('active');
    }

    this.speak(qaItem.answer);
  }

  bindEvents() {
    // 3D Parallax perspective on mouse move (only desktop/fine-pointer)
    if (window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        const rect = this.container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth * 0.5);
        this.mouse.targetY = (e.clientY - centerY) / (window.innerHeight * 0.5);
      }, { passive: true });
    }

    // Bind persona buttons in DOM
    document.querySelectorAll('.persona-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const persona = btn.dataset.persona;
        if (persona) {
          this.switchPersona(persona, true);
        }
      });
    });

    // Voice Toggle button handler
    const handleVoiceToggle = () => {
      this.audioEnabled = !this.audioEnabled;
      const heroToggle = document.getElementById('hero-voice-toggle-btn');
      
      if (this.audioEnabled) {
        if (heroToggle) {
          heroToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span class="voice-btn-label">Speaking</span>';
          heroToggle.classList.add('active');
        }
        const text = this.activeQAId 
          ? CONCIERGE_QA_MATRIX.find(q => q.id === this.activeQAId)?.answer || this.personas[this.activePersona].greeting
          : this.personas[this.activePersona].greeting;
        this.speak(text);
      } else {
        if (heroToggle) {
          heroToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span class="voice-btn-label">Listen</span>';
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

  switchPersona(personaKey, triggerSpeech = true) {
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

    // Update host bar identity
    const hostNameEl = document.getElementById('avatar-host-name');
    if (hostNameEl) hostNameEl.textContent = persona.name;
    const hostBadgeEl = document.getElementById('avatar-host-badge');
    if (hostBadgeEl) hostBadgeEl.textContent = persona.badge;
    const hostRoleEl = document.getElementById('avatar-host-role');
    if (hostRoleEl) hostRoleEl.textContent = `${persona.role} • Klang`;

    // Update badge in avatar
    if (this.badgeTextEl) {
      this.badgeTextEl.textContent = persona.name;
    }

    // Update speech text in bubble if not answering a specific QA
    if (triggerSpeech) {
      this.activeQAId = null;
      const chips = document.querySelectorAll('.qa-chip-btn');
      chips.forEach(chip => chip.classList.remove('active'));

      const speechTextEl = document.getElementById('avatar-speech-text');
      if (speechTextEl) {
        speechTextEl.textContent = `"${persona.greeting}"`;
      }

      if (this.audioEnabled) {
        this.speak(persona.greeting);
      } else {
        this.setSpeaking(true);
        setTimeout(() => this.setSpeaking(false), 2400);
      }
    }

    // Also update any concierge avatar label elsewhere on page
    const guideLabel = document.querySelector('.concierge-avatar-label');
    if (guideLabel) guideLabel.textContent = `${persona.name} • ${persona.role}`;
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
      }, Math.min(4500, Math.max(2200, text.length * 45)));
      return;
    }

    this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const persona = this.personas[this.activePersona];
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    const voice = this.getBestVoice(this.activePersona);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => {
      this.setSpeaking(false);
      if (speechBubble) speechBubble.classList.remove('speaking');
      const heroToggle = document.getElementById('hero-voice-toggle-btn');
      if (heroToggle && !this.audioEnabled) {
        heroToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Listen to Host</span>';
        heroToggle.classList.remove('active');
      }
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

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    const animate = (timestamp) => {
      if (!this.isVisible || document.hidden || (this.container && this.container.offsetParent === null)) {
        this.animFrameId = null;
        return;
      }

      const elapsed = (timestamp - this.startTime) / 1000;

      // Smooth interpolation for mouse gaze on desktop
      if (isFinePointer) {
        this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
        this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;
      }

      // Natural respiration & micro-sway (HeyGen style subtle breathing)
      const breathY = Math.sin(elapsed * 1.6) * 1.8;
      const breathScale = 1.0 + Math.sin(elapsed * 1.6) * 0.006;
      const rotY = isFinePointer ? this.mouse.x * 5 : 0;
      const rotX = isFinePointer ? -this.mouse.y * 4 : 0;

      if (this.stackEl) {
        this.stackEl.style.transform = `
          perspective(600px)
          translate3d(0, ${breathY.toFixed(2)}px, 0)
          rotateY(${rotY.toFixed(2)}deg)
          rotateX(${rotX.toFixed(2)}deg)
          scale(${breathScale.toFixed(4)})
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
        barHeight = Math.max(2, Math.abs(freq) * 5);
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
