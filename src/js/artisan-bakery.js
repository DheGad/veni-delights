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
    const lavaCore = document.getElementById('molten-lava-flow');
    const tempBadge = document.getElementById('molten-temp-value');
    const statusText = document.getElementById('molten-cut-status');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.cutProgress = val;

      if (lavaCore) {
        // Expand molten lava ooze height and scale
        lavaCore.style.height = `${val * 0.95}%`;
        lavaCore.style.opacity = Math.min(1, val / 15 + 0.1);
        lavaCore.style.transform = `scaleY(${1 + (val / 100) * 0.4}) translateZ(0)`;
      }

      if (tempBadge) {
        // Temperature rises to molten peak
        const temp = Math.round(52 + (val / 100) * 16);
        tempBadge.textContent = `${temp}°C Molten Core`;
      }

      if (statusText) {
        if (val < 20) {
          statusText.textContent = "Crispy golden butter shell intact.";
        } else if (val < 60) {
          statusText.textContent = "Crust cracking open... warm cheese lava beginning to flow!";
        } else {
          statusText.textContent = "Full molten lava ooze! Cream cheese & mascarpone flow perfection.";
        }
      }
    });
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
