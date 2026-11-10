/**
 * VENI DELIGHTS — ARTISAN MOLTEN CHEESE TARTS & LIVE BAKERY SIMULATION ENGINE
 * Powers the interactive real bakery kitchen experience:
 * - Live Stone Deck Oven & Chef Workstation viewport
 * - Real-time rising steam & heat haze canvas particle simulation
 * - Interactive Hotspot pins with detailed kitchen craftsmanship insights
 * - Interactive Molten Tart Cut Simulator (user cuts the tart to watch molten lava cheese ooze)
 * - Synthesized Bakery Sound FX (stone oven crackle, butter sizzle via Web Audio API)
 * - Flavour selector & 1-click cart insertion
 */

export class ArtisanBakeryExperience {
  constructor() {
    this.heroStage = document.getElementById('hero-cheese-lab-stage');
    this.showcaseStage = document.getElementById('artisan-bakery-viewport');
    this.soundActive = false;
    this.audioCtx = null;
    this.crackleNode = null;
    this.cutProgress = 0;

    this.flavours = {
      original: {
        name: 'Original Golden Molten Cheese Tart',
        tag: 'Signature Best-Seller',
        pricePerUnit: 2.50,
        temp: '68°C',
        cheeseType: 'Triple Blend (Cream Cheese, Mascarpone, Hokkaido Mild)',
        crust: 'Fluted Pure Butter Shortcrust',
        desc: 'Crisp, crumbly butter shell holding warm, sweet-savory molten lava cheese that flows on the very first bite.'
      },
      blueberry: {
        name: 'Blueberry Molten Cheese Tart',
        tag: 'Wild Berry Infusion',
        pricePerUnit: 2.80,
        temp: '66°C',
        cheeseType: 'Cream Cheese infused with Wild Blueberry Compote',
        crust: 'French Golden Churn Butter Shell',
        desc: 'Rich molten cheese center crowned with vibrant simmered blueberry compote for a tart, fragrant balance.'
      },
      chocolate: {
        name: 'Belgian Dark Chocolate Molten Tart',
        tag: 'Decadent Indulgence',
        pricePerUnit: 3.00,
        temp: '70°C',
        cheeseType: '70% Belgian Dark Chocolate & Cream Cheese Ganache',
        crust: 'Cocoa Butter Sablé Shell',
        desc: 'Deep bittersweet chocolate molten core that flows luxuriously inside a crisp dark chocolate crust.'
      },
      strawberry: {
        name: 'Fresh Strawberry Lava Molten Tart',
        tag: 'Cameron Harvest',
        pricePerUnit: 2.80,
        temp: '67°C',
        cheeseType: 'Mascarpone infused with Fresh Strawberry Puree',
        crust: 'Pure Butter Sablé Shell',
        desc: 'Luscious, blushing pink molten cheese center infused with natural Cameron Highlands strawberries.'
      }
    };

    this.activeFlavour = 'original';

    this.init();
  }

  init() {
    this.initSteamCanvases();
    this.initHotspots();
    this.initCutSimulator();
    this.initFlavourTabs();
    this.initSoundToggle();
    this.initStageTabs();
  }

  /* ----------------------------------------------------
   * 1. Dynamic Rising Steam & Heat Haze Canvas Particle System
   * ---------------------------------------------------- */
  initSteamCanvases() {
    const steamCanvases = document.querySelectorAll('.bakery-steam-canvas');
    steamCanvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const particles = [];
      const particleCount = 28;

      // Resize canvas to match display size
      const updateSize = () => {
        canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
        canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : 400;
      };
      updateSize();
      window.addEventListener('resize', updateSize, { passive: true });

      // Create steam puffs
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: canvas.width * 0.45 + (Math.random() - 0.5) * (canvas.width * 0.4),
          y: canvas.height * 0.85 + Math.random() * (canvas.height * 0.15),
          radius: 14 + Math.random() * 24,
          maxRadius: 40 + Math.random() * 40,
          speedY: 0.6 + Math.random() * 1.2,
          speedX: (Math.random() - 0.5) * 0.5,
          alpha: 0.05 + Math.random() * 0.12,
          maxAlpha: 0.18 + Math.random() * 0.1,
          life: Math.random()
        });
      }

      let isVisible = true;
      let animId = null;

      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting && !document.hidden;
            if (isVisible && !animId) {
              animId = requestAnimationFrame(animateSteam);
            }
          });
        }, { threshold: 0.05 });
        observer.observe(canvas);
      }

      document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible && !animId) {
          animId = requestAnimationFrame(animateSteam);
        }
      });

      const animateSteam = () => {
        if (!isVisible) {
          animId = null;
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
          p.y -= p.speedY;
          p.x += p.speedX + Math.sin(p.life * 4) * 0.3;
          p.life += 0.008;
          p.radius += 0.35;

          // Fade in then fade out
          let currentAlpha = 0;
          if (p.life < 0.3) {
            currentAlpha = (p.life / 0.3) * p.maxAlpha;
          } else {
            currentAlpha = (1 - (p.life - 0.3) / 0.7) * p.maxAlpha;
          }

          if (p.life >= 1.0 || p.y <= 0) {
            // Reset particle at hot tart tray
            p.x = canvas.width * 0.45 + (Math.random() - 0.5) * (canvas.width * 0.4);
            p.y = canvas.height * 0.85;
            p.radius = 12 + Math.random() * 18;
            p.life = 0;
          }

          if (currentAlpha > 0) {
            const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
            radGrad.addColorStop(0, `rgba(255, 245, 230, ${currentAlpha})`);
            radGrad.addColorStop(0.6, `rgba(240, 220, 190, ${currentAlpha * 0.4})`);
            radGrad.addColorStop(1, 'rgba(240, 220, 190, 0)');

            ctx.fillStyle = radGrad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        animId = requestAnimationFrame(animateSteam);
      };

      animId = requestAnimationFrame(animateSteam);
    });
  }

  /* ----------------------------------------------------
   * 2. Interactive Bakery Hotspots
   * ---------------------------------------------------- */
  initHotspots() {
    const hotspots = document.querySelectorAll('.bakery-hotspot');
    const infoCard = document.getElementById('hotspot-active-info');

    hotspots.forEach(spot => {
      const showInfo = () => {
        hotspots.forEach(s => s.classList.remove('active'));
        spot.classList.add('active');

        const title = spot.dataset.title;
        const desc = spot.dataset.desc;
        const stat = spot.dataset.stat;

        if (infoCard) {
          infoCard.innerHTML = `
            <div class="info-card-header">
              <span class="info-stat-pill">${stat || 'ARTISAN DETAIL'}</span>
              <button class="info-close-btn" aria-label="Close detail">&times;</button>
            </div>
            <h4 class="info-title">${title}</h4>
            <p class="info-desc">${desc}</p>
          `;
          infoCard.classList.add('visible');

          const closeBtn = infoCard.querySelector('.info-close-btn');
          if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              infoCard.classList.remove('visible');
              spot.classList.remove('active');
            });
          }
        }
      };

      spot.addEventListener('click', showInfo);
      spot.addEventListener('mouseenter', showInfo);
    });
  }

  /* ----------------------------------------------------
   * 3. Interactive Molten Tart Cut Simulator
   * ---------------------------------------------------- */
  initCutSimulator() {
    const slider = document.getElementById('molten-cut-slider');
    const shellLeft = document.getElementById('tart-shell-left');
    const shellRight = document.getElementById('tart-shell-right');
    const lavaCore = document.getElementById('molten-lava-flow');
    const knifeBlade = document.getElementById('sim-knife-blade');
    const drips = document.getElementById('lava-drips');
    const tempBadge = document.getElementById('molten-temp-value');
    const statusText = document.getElementById('molten-cut-status');
    const percentLabel = document.getElementById('sim-cut-percent');
    const presetBtns = document.querySelectorAll('.preset-cut-btn');
    const flavourPills = document.querySelectorAll('.flavour-pill-btn');
    const flavourBadge = document.getElementById('tart-cut-flavour-badge');
    const orderCta = document.getElementById('btn-order-molten-direct');
    const orderText = document.getElementById('molten-order-cta-text');

    if (!slider) return;

    // Flavour styling and gradient definitions
    const flavourStyles = {
      original: {
        badge: '🧀 Original Triple-Cheese',
        cta: 'Order Hot Tarts (10 pcs - RM25)',
        waText: 'Hello Veni Delights! I would like to order the Signature Original Molten Cheese Tarts (Box of 10 pcs - RM25).',
        stops: ['#FFF2A3', '#FFD152', '#FF9F1C', '#E67E22']
      },
      blueberry: {
        badge: '🫐 Wild Blueberry Lava',
        cta: 'Order Blueberry Tarts (10 pcs - RM28)',
        waText: 'Hello Veni Delights! I would like to order the Wild Blueberry Molten Cheese Tarts (Box of 10 pcs - RM28).',
        stops: ['#E0D8FF', '#A29BFE', '#6C5CE7', '#4834D4']
      },
      chocolate: {
        badge: '🍫 Belgian Dark Choc Lava',
        cta: 'Order Dark Choc Tarts (10 pcs - RM30)',
        waText: 'Hello Veni Delights! I would like to order the Belgian Dark Chocolate Molten Tarts (Box of 10 pcs - RM30).',
        stops: ['#D7CCC8', '#8D6E63', '#5D4037', '#3E2723']
      },
      strawberry: {
        badge: '🍓 Fresh Strawberry Lava',
        cta: 'Order Strawberry Tarts (10 pcs - RM28)',
        waText: 'Hello Veni Delights! I would like to order the Fresh Strawberry Molten Cheese Tarts (Box of 10 pcs - RM28).',
        stops: ['#FFEAEA', '#FF7675', '#D63031', '#A92D42']
      }
    };

    let activeFlavourKey = 'original';

    // Core Cut Update Function
    const updateCutSimulation = (val) => {
      const clamped = Math.max(0, Math.min(100, val));
      this.cutProgress = clamped;
      const t = clamped / 100;

      // 1. Animate crust shells splitting open
      if (shellLeft) {
        shellLeft.style.transform = `translateX(-${t * 22}px) rotate(-${t * 3.5}deg)`;
      }
      if (shellRight) {
        shellRight.style.transform = `translateX(${t * 22}px) rotate(${t * 3.5}deg)`;
      }

      // 2. Animate slicing knife indicator
      if (knifeBlade) {
        if (clamped > 2 && clamped < 95) {
          knifeBlade.style.opacity = '1';
          knifeBlade.style.transform = `translate(-50%, ${t * 45 - 20}px)`;
        } else {
          knifeBlade.style.opacity = '0';
          knifeBlade.style.transform = `translate(-50%, -30px)`;
        }
      }

      // 3. Animate molten cheese lava ooze
      if (lavaCore) {
        if (clamped <= 0) {
          lavaCore.style.opacity = '0';
          lavaCore.style.transform = 'scale(0.1) translateZ(0)';
        } else {
          lavaCore.style.opacity = `${Math.min(1, t * 1.6 + 0.15)}`;
          lavaCore.style.transform = `scaleY(${0.35 + t * 0.75}) scaleX(${0.4 + t * 0.6}) translateZ(0)`;
        }
      }

      // 4. Animate dripping cheese droplets
      if (drips) {
        drips.style.opacity = t > 0.4 ? `${Math.min(1, (t - 0.4) * 2)}` : '0';
      }

      // 5. Update core temperature badge
      if (tempBadge) {
        const temp = Math.round(25 + t * 43); // 25°C to 68°C
        tempBadge.textContent = `${temp}°C Molten Core`;
        tempBadge.style.color = t > 0.65 ? '#ff4757' : (t > 0.25 ? '#ff9f43' : '#c9a84c');
        tempBadge.style.borderColor = t > 0.65 ? 'rgba(255, 71, 87, 0.4)' : 'rgba(255, 159, 67, 0.3)';
      }

      // 6. Update percentage and status text
      if (percentLabel) {
        percentLabel.textContent = `${Math.round(clamped)}% Sliced`;
      }

      if (statusText) {
        if (clamped < 15) {
          statusText.textContent = "🥧 Crisp golden butter shell intact (25°C). Slide knife or tap presets to cut!";
        } else if (clamped < 50) {
          statusText.textContent = "🔪 First incision! Crispy shell cracks open, warm cheese lava emerging...";
        } else if (clamped < 85) {
          statusText.textContent = "🔥 Warm cheese lava oozing! Triple-blend cream cheese & mascarpone cascading.";
        } else {
          statusText.textContent = "🌋 Maximum molten rush (68°C)! Pure velvety cheese lava dripping perfection.";
        }
      }

      // 7. Update preset buttons active state
      presetBtns.forEach(btn => {
        const cutVal = parseFloat(btn.dataset.cut);
        if (clamped <= 20) {
          btn.classList.toggle('active', cutVal === 0);
        } else if (clamped >= 80) {
          btn.classList.toggle('active', cutVal === 100);
        } else {
          btn.classList.toggle('active', cutVal === 50);
        }
      });
    };

    // Slider Event
    slider.addEventListener('input', (e) => {
      updateCutSimulation(parseFloat(e.target.value));
    });

    // Preset Buttons Click
    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetCut = parseFloat(btn.dataset.cut);
        slider.value = targetCut;
        updateCutSimulation(targetCut);
      });
    });

    // Flavour Switcher
    const applyFlavour = (flavourKey) => {
      activeFlavourKey = flavourKey;
      const data = flavourStyles[flavourKey] || flavourStyles.original;

      flavourPills.forEach(btn => {
        const isActive = btn.dataset.flavour === flavourKey;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (flavourBadge) {
        flavourBadge.textContent = data.badge;
      }

      if (orderCta) {
        orderCta.href = `https://wa.me/60123360470?text=${encodeURIComponent(data.waText)}`;
      }

      if (orderText) {
        orderText.textContent = data.cta;
      }

      // Update SVG gradient stops
      const s1 = document.getElementById('lava-stop-1');
      const s2 = document.getElementById('lava-stop-2');
      const s3 = document.getElementById('lava-stop-3');
      const s4 = document.getElementById('lava-stop-4');
      if (s1 && s2 && s3 && s4 && data.stops) {
        s1.setAttribute('stop-color', data.stops[0]);
        s2.setAttribute('stop-color', data.stops[1]);
        s3.setAttribute('stop-color', data.stops[2]);
        s4.setAttribute('stop-color', data.stops[3]);
      }
    };

    flavourPills.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFlavour(btn.dataset.flavour);
      });
    });

    // Dedicated Tart Steam Canvas Particle Simulation
    const steamCanvas = document.getElementById('tart-cut-steam-canvas');
    if (steamCanvas) {
      const sCtx = steamCanvas.getContext('2d');
      if (sCtx) {
        const steamPuffs = [];
        const puffCount = 18;

        for (let i = 0; i < puffCount; i++) {
          steamPuffs.push({
            x: steamCanvas.width * 0.5 + (Math.random() - 0.5) * 60,
            y: steamCanvas.height * 0.85 + Math.random() * 20,
            radius: 8 + Math.random() * 14,
            maxRadius: 26 + Math.random() * 20,
            speedY: 0.5 + Math.random() * 0.9,
            speedX: (Math.random() - 0.5) * 0.4,
            alpha: 0.04 + Math.random() * 0.1,
            maxAlpha: 0.16 + Math.random() * 0.08,
            life: Math.random()
          });
        }

        const renderTartSteam = () => {
          sCtx.clearRect(0, 0, steamCanvas.width, steamCanvas.height);
          const intensity = Math.max(0.15, this.cutProgress / 100);

          steamPuffs.forEach(p => {
            p.y -= p.speedY * (0.6 + intensity * 0.8);
            p.x += p.speedX;
            p.life += 0.012;

            if (p.life > 1 || p.y < 0) {
              p.life = 0;
              p.x = steamCanvas.width * 0.5 + (Math.random() - 0.5) * (40 + intensity * 40);
              p.y = steamCanvas.height * 0.82;
            }

            const currentRadius = p.radius + (p.maxRadius - p.radius) * p.life;
            const currentAlpha = Math.sin(p.life * Math.PI) * p.maxAlpha * intensity;

            const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius);
            grad.addColorStop(0, `rgba(255, 245, 230, ${currentAlpha})`);
            grad.addColorStop(0.5, `rgba(255, 220, 180, ${currentAlpha * 0.5})`);
            grad.addColorStop(1, 'rgba(255, 220, 180, 0)');

            sCtx.fillStyle = grad;
            sCtx.beginPath();
            sCtx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
            sCtx.fill();
          });

          requestAnimationFrame(renderTartSteam);
        };
        requestAnimationFrame(renderTartSteam);
      }
    }

    // Initial state setup (70% cut out-of-the-box for instant mouthwatering delight)
    updateCutSimulation(70);
  }

  /* ----------------------------------------------------
   * 4. Flavour Selector Tabs
   * ---------------------------------------------------- */
  initFlavourTabs() {
    const flavourBtns = document.querySelectorAll('.flavour-tab-btn');
    flavourBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        flavourBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const flavourKey = btn.dataset.flavour;
        if (this.flavours[flavourKey]) {
          this.activeFlavour = flavourKey;
          this.updateFlavourDetails(this.flavours[flavourKey]);
        }
      });
    });
  }

  updateFlavourDetails(data) {
    const titleEl = document.getElementById('flavour-display-title');
    const tagEl = document.getElementById('flavour-display-tag');
    const descEl = document.getElementById('flavour-display-desc');
    const cheeseEl = document.getElementById('flavour-display-cheese');
    const crustEl = document.getElementById('flavour-display-crust');
    const priceEl = document.getElementById('flavour-display-price');

    if (titleEl) titleEl.textContent = data.name;
    if (tagEl) tagEl.textContent = data.tag;
    if (descEl) descEl.textContent = data.desc;
    if (cheeseEl) cheeseEl.textContent = data.cheeseType;
    if (crustEl) crustEl.textContent = data.crust;
    if (priceEl) priceEl.textContent = `RM${data.pricePerUnit.toFixed(2)} / pc (Min 10 pcs)`;

    // Update order CTA text
    const orderBtn = document.getElementById('artisan-order-flavour-btn');
    if (orderBtn) {
      orderBtn.textContent = `Order ${data.name} (10 pcs - RM${(data.pricePerUnit * 10).toFixed(0)})`;
    }
  }

  /* ----------------------------------------------------
   * 5. Synthesized Bakery Sound FX (Web Audio API)
   * ---------------------------------------------------- */
  initSoundToggle() {
    const soundBtns = document.querySelectorAll('.bakery-sound-toggle');
    soundBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.soundActive = !this.soundActive;

        soundBtns.forEach(b => {
          b.classList.toggle('active', this.soundActive);
          b.innerHTML = this.soundActive 
            ? '<i class="fa-solid fa-volume-high"></i> <span>Kitchen Ambiance: Active</span>'
            : '<i class="fa-solid fa-volume-xmark"></i> <span>Listen to Bakery</span>';
        });

        if (this.soundActive) {
          this.startBakeryAmbiance();
        } else {
          this.stopBakeryAmbiance();
        }
      });
    });
  }

  startBakeryAmbiance() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) {
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Generate soft stone-oven crackle + kitchen warmth using filtered white noise
      const bufferSize = this.audioCtx.sampleRate * 2;
      const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Pink-like soothing ambient noise with random crackle pops
        output[i] = (Math.random() * 2 - 1) * 0.15;
        if (Math.random() < 0.002) {
          output[i] = (Math.random() * 2 - 1) * 0.85; // crackle pop
        }
      }

      this.crackleSource = this.audioCtx.createBufferSource();
      this.crackleSource.buffer = noiseBuffer;
      this.crackleSource.loop = true;

      // Bandpass filter to make it sound like glowing oven embers
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 650;
      filter.Q.value = 1.2;

      // Soft gain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.04, this.audioCtx.currentTime);

      this.crackleSource.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.crackleSource.start();
    } catch (e) {
      console.warn('Web Audio bakery ambiance error:', e);
    }
  }

  stopBakeryAmbiance() {
    try {
      if (this.gainNode && this.audioCtx) {
        this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.2);
        setTimeout(() => {
          if (this.crackleSource) {
            this.crackleSource.stop();
            this.crackleSource.disconnect();
          }
        }, 300);
      }
    } catch (e) {
      console.warn('Stop ambiance error:', e);
    }
  }

  /* ----------------------------------------------------
   * 6. Hero Right Column Stage Mode Switcher (3D vs Cheese Lab)
   * ---------------------------------------------------- */
  initStageTabs() {
    const tabs = document.querySelectorAll('.hero-stage-toggle-btn');
    const stage3D = document.getElementById('hero-3d-stage');
    const cheeseLab = document.getElementById('hero-cheese-lab-stage');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const mode = tab.dataset.mode;
        if (mode === 'cheese-lab') {
          if (cheeseLab) cheeseLab.classList.add('active');
          if (stage3D) stage3D.classList.remove('active');
        } else {
          if (cheeseLab) cheeseLab.classList.remove('active');
          if (stage3D) stage3D.classList.add('active');
        }
      });
    });
  }
}
