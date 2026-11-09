/**
 * VENI DELIGHTS — DIGITAL HUMAN AVATAR ENGINE (3D WebGL)
 * World-Class 3D Baker Avatar with Skeleton, Blendshapes, Procedural Rigging,
 * Lighting, Speech Synthesis with Subtitles, and Interactive States.
 *
 * Characters:
 * - AVATAR 1: Veni Host (Virtual Concierge & Greetings)
 * - AVATAR 2: Master Baker (Storytelling & Butter Series / Brownies)
 * - AVATAR 3: Dessert Specialist (Tarts, Pavlova & Dessert Corner)
 */

import * as THREE from 'three';

export class VeniDigitalHuman {
  constructor(containerId = 'avatar-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.activePersona = 'host'; // 'host' | 'baker' | 'specialist'
    this.state = 'idle'; // 'idle' | 'greet' | 'explain' | 'think' | 'talk' | 'celebrate'
    this.isSpeaking = false;
    this.audioEnabled = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.clock = new THREE.Clock();
    this.blinkTimer = 0;
    this.nextBlinkTime = 2 + Math.random() * 3;
    this.speechTimer = 0;

    // Personas configuration
    this.personas = {
      host: {
        name: 'Veni Host',
        title: 'Virtual Concierge',
        badge: 'Concierge Lead',
        accentColor: 0xC9A84C,
        greeting: "Welcome to Veni Delights! I am your personal host. Let me guide you to our finest handcrafted desserts.",
        voicePitch: 1.05,
        voiceRate: 0.95
      },
      baker: {
        name: 'Master Baker',
        title: 'Artisan Chef',
        badge: 'Kitchen Craftsman',
        accentColor: 0xD4AF37,
        greeting: "Greetings! Pure butter, slow baking, and timeless recipes are the secret to our Butter Series and Brownies.",
        voicePitch: 0.92,
        voiceRate: 0.92
      },
      specialist: {
        name: 'Dessert Specialist',
        title: 'Celebration Stylist',
        badge: 'Event Curator',
        accentColor: 0xF0C860,
        greeting: "Looking for something magnificent? Our Pavlova, Cheese Tarts, and Dessert Corner tables transform every celebration.",
        voicePitch: 1.1,
        voiceRate: 0.98
      }
    };

    this.init();
  }

  init() {
    // Check WebGL availability
    if (!this.checkWebGL()) {
      this.showFallback('WebGL is disabled or unsupported.');
      return;
    }

    this.setupScene();
    this.setupLights();
    this.buildCharacterMesh();
    this.setupControlsUI();
    this.setupSpeechSynthesis();
    this.bindEvents();
    this.animate();
  }

  checkWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  setupScene() {
    const width = this.container.clientWidth || 320;
    const height = this.container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.scene.background = null; // transparent to blend with dark card

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.camera.position.set(0, 1.45, 2.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear fallback and attach canvas
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.7);
    this.scene.add(ambientLight);

    // Warm Key Light (Champagne Gold)
    this.keyLight = new THREE.DirectionalLight(0xffecd2, 1.8);
    this.keyLight.position.set(1.5, 3, 2.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 1024;
    this.keyLight.shadow.mapSize.height = 1024;
    this.scene.add(this.keyLight);

    // Cool Soft Fill Light
    this.fillLight = new THREE.DirectionalLight(0xdce7f0, 0.8);
    this.fillLight.position.set(-2, 1.5, 1.8);
    this.scene.add(this.fillLight);

    // Rim / Hair Light (Antique Gold Luxury Accent)
    this.rimLight = new THREE.DirectionalLight(0xc9a84c, 2.2);
    this.rimLight.position.set(0, 3, -2);
    this.scene.add(this.rimLight);
  }

  buildCharacterMesh() {
    this.characterGroup = new THREE.Group();
    this.scene.add(this.characterGroup);

    // Materials
    this.materials = {
      skin: new THREE.MeshPhysicalMaterial({
        color: 0xdfab8e,
        roughness: 0.55,
        metalness: 0.05,
        clearcoat: 0.1,
        clearcoatRoughness: 0.25,
        sheen: 0.35,
        sheenColor: new THREE.Color(0xffaf88),
      }),
      eyes: new THREE.MeshPhysicalMaterial({
        color: 0x2c1d11, // Deep espresso brown iris
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 0.9,
      }),
      sclera: new THREE.MeshStandardMaterial({
        color: 0xf8f9fa,
        roughness: 0.3,
      }),
      lips: new THREE.MeshStandardMaterial({
        color: 0xba6868,
        roughness: 0.4,
      }),
      uniform: new THREE.MeshStandardMaterial({
        color: 0x111111, // Premium sleek black chef jacket
        roughness: 0.7,
        metalness: 0.1,
      }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: 0xc9a84c, // Veni gold embroidery
        roughness: 0.3,
        metalness: 0.85,
      }),
      apron: new THREE.MeshStandardMaterial({
        color: 0x1c1917,
        roughness: 0.8,
      }),
      hat: new THREE.MeshStandardMaterial({
        color: 0xfaf7f0, // White artisan baker toque
        roughness: 0.85,
      }),
      hair: new THREE.MeshStandardMaterial({
        color: 0x1b130e,
        roughness: 0.9,
      })
    };

    // 1. Torso & Elegant Chef Uniform
    const torsoGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.9, 32);
    this.torso = new THREE.Mesh(torsoGeo, this.materials.uniform);
    this.torso.position.y = 0.55;
    this.characterGroup.add(this.torso);

    // Chef Jacket Double-Breasted Gold Buttons
    for (let row = 0; row < 3; row++) {
      for (let col = -1; col <= 1; col += 2) {
        const btnGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.01, 16);
        const btn = new THREE.Mesh(btnGeo, this.materials.goldTrim);
        btn.rotation.x = Math.PI / 2;
        btn.position.set(col * 0.07, 0.78 - row * 0.12, 0.38);
        this.torso.add(btn);
      }
    }

    // Embroidered Veni Delights Gold Emblem Badge on Chest
    const badgeGeo = new THREE.CircleGeometry(0.04, 32);
    const badge = new THREE.Mesh(badgeGeo, this.materials.goldTrim);
    badge.position.set(-0.18, 0.82, 0.36);
    this.torso.add(badge);

    // Collar
    const collarGeo = new THREE.TorusGeometry(0.2, 0.035, 16, 32, Math.PI);
    const collar = new THREE.Mesh(collarGeo, this.materials.goldTrim);
    collar.rotation.x = -Math.PI / 2;
    collar.position.set(0, 0.98, 0);
    this.torso.add(collar);

    // 2. Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.22, 24);
    this.neck = new THREE.Mesh(neckGeo, this.materials.skin);
    this.neck.position.y = 1.05;
    this.characterGroup.add(this.neck);

    // 3. Head & Face Rig
    this.headGroup = new THREE.Group();
    this.headGroup.position.set(0, 1.28, 0);
    this.characterGroup.add(this.headGroup);

    // Cranium / Face Base
    const headGeo = new THREE.SphereGeometry(0.23, 32, 32);
    headGeo.scale(0.92, 1.15, 1.0);
    this.head = new THREE.Mesh(headGeo, this.materials.skin);
    this.headGroup.add(this.head);

    // Styled Hair
    const hairGeo = new THREE.SphereGeometry(0.25, 24, 24);
    hairGeo.scale(0.96, 1.1, 1.05);
    const hair = new THREE.Mesh(hairGeo, this.materials.hair);
    hair.position.set(0, 0.06, -0.04);
    this.headGroup.add(hair);

    // Chef Hat (Toque Blanche)
    const hatBaseGeo = new THREE.CylinderGeometry(0.23, 0.23, 0.12, 32);
    const hatBase = new THREE.Mesh(hatBaseGeo, this.materials.goldTrim);
    hatBase.position.set(0, 0.24, 0);
    this.headGroup.add(hatBase);

    const hatTopGeo = new THREE.CylinderGeometry(0.28, 0.22, 0.35, 32);
    const hatTop = new THREE.Mesh(hatTopGeo, this.materials.hat);
    hatTop.position.set(0, 0.44, -0.02);
    this.headGroup.add(hatTop);

    // 4. Eyes Assembly (Left & Right)
    this.eyes = [];
    this.eyelids = [];

    [-0.08, 0.08].forEach((xOffset, idx) => {
      // Sclera (eyeball)
      const eyeSclera = new THREE.Mesh(new THREE.SphereGeometry(0.042, 24, 24), this.materials.sclera);
      eyeSclera.position.set(xOffset, 0.035, 0.19);

      // Iris & Pupil
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.022, 24), this.materials.eyes);
      iris.position.set(0, 0, 0.041);
      eyeSclera.add(iris);

      // Pupil reflection highlight
      const glint = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      glint.position.set(0.008, 0.008, 0.042);
      eyeSclera.add(glint);

      this.headGroup.add(eyeSclera);
      this.eyes.push(eyeSclera);

      // Eyelid for blinking
      const lidGeo = new THREE.SphereGeometry(0.045, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const eyelid = new THREE.Mesh(lidGeo, this.materials.skin);
      eyelid.position.set(xOffset, 0.04, 0.19);
      eyelid.rotation.x = -Math.PI * 0.45; // open
      this.headGroup.add(eyelid);
      this.eyelids.push(eyelid);
    });

    // Eyebrows
    [-0.08, 0.08].forEach((xOffset) => {
      const browGeo = new THREE.BoxGeometry(0.065, 0.012, 0.02);
      const brow = new THREE.Mesh(browGeo, this.materials.hair);
      brow.position.set(xOffset, 0.095, 0.215);
      brow.rotation.z = xOffset > 0 ? -0.08 : 0.08;
      this.headGroup.add(brow);
    });

    // 5. Mouth & Jaw Blendshape / Mesh for Speech Animation
    const mouthGeo = new THREE.BoxGeometry(0.08, 0.02, 0.02);
    this.mouth = new THREE.Mesh(mouthGeo, this.materials.lips);
    this.mouth.position.set(0, -0.11, 0.215);
    this.headGroup.add(this.mouth);

    // Initial positioning
    this.characterGroup.position.y = -0.65;
  }

  setupControlsUI() {
    // Add interactive persona switch & audio narration pill inside avatar container
    const hud = document.createElement('div');
    hud.className = 'avatar-hud';
    hud.innerHTML = `
      <div class="avatar-persona-selector" role="group" aria-label="Select avatar guide">
        <button class="persona-btn active" data-persona="host" title="Veni Host">Host</button>
        <button class="persona-btn" data-persona="baker" title="Master Baker">Baker</button>
        <button class="persona-btn" data-persona="specialist" title="Dessert Specialist">Specialist</button>
      </div>

      <div class="avatar-speech-controls">
        <button class="avatar-audio-toggle" id="avatar-audio-toggle" aria-label="Toggle avatar speech voice">
          <i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
          <span>Voice: Muted</span>
        </button>
      </div>

      <div class="avatar-captions" id="avatar-captions" aria-live="polite">
        "Hello! Welcome to Veni Delights. Freshly homemade, crafted with love."
      </div>
    `;

    this.container.appendChild(hud);
    this.captionsEl = hud.querySelector('#avatar-captions');
    this.audioToggleBtn = hud.querySelector('#avatar-audio-toggle');

    // Bind persona switching
    hud.querySelectorAll('.persona-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        hud.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchPersona(btn.dataset.persona);
      });
    });

    // Audio toggle
    this.audioToggleBtn.addEventListener('click', () => {
      this.audioEnabled = !this.audioEnabled;
      if (this.audioEnabled) {
        this.audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Voice: Active</span>';
        this.audioToggleBtn.classList.add('active');
        this.speak(this.personas[this.activePersona].greeting);
      } else {
        this.audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span>Voice: Muted</span>';
        this.audioToggleBtn.classList.remove('active');
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        this.isSpeaking = false;
      }
    });
  }

  setupSpeechSynthesis() {
    this.synth = window.speechSynthesis || null;
  }

  speak(text) {
    if (this.captionsEl) {
      this.captionsEl.textContent = `"${text}"`;
      this.captionsEl.classList.add('speaking');
    }

    if (!this.audioEnabled || !this.synth) {
      // Simulate speaking animation visual even if audio is muted
      this.isSpeaking = true;
      this.speechTimer = Math.max(3, text.length * 0.06);
      return;
    }

    this.synth.cancel(); // Stop prior utterance
    const utterance = new SpeechSynthesisUtterance(text);
    const persona = this.personas[this.activePersona];
    utterance.pitch = persona.voicePitch;
    utterance.rate = persona.voiceRate;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.captionsEl) this.captionsEl.classList.remove('speaking');
    };
    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.captionsEl) this.captionsEl.classList.remove('speaking');
    };

    this.synth.speak(utterance);
  }

  switchPersona(personaKey) {
    if (!this.personas[personaKey]) return;
    this.activePersona = personaKey;
    const persona = this.personas[personaKey];

    // Update avatar uniform accent color
    this.materials.goldTrim.color.setHex(persona.accentColor);
    if (personaKey === 'baker') {
      this.materials.uniform.color.setHex(0x2a1b14); // artisanal chocolate brown
    } else if (personaKey === 'specialist') {
      this.materials.uniform.color.setHex(0x1a1c23); // deep celebration midnight
    } else {
      this.materials.uniform.color.setHex(0x111110); // onyx black
    }

    // Update label in DOM
    const labelEl = document.querySelector('.concierge-avatar-label');
    if (labelEl) labelEl.textContent = persona.name;

    // Trigger state & speech
    this.setState('greet');
    this.speak(persona.greeting);
  }

  setState(newState) {
    this.state = newState;
  }

  bindEvents() {
    // Mouse tracking for realistic eye & head movement
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      this.mouse.targetX = (e.clientX - centerX) / (window.innerWidth * 0.5);
      this.mouse.targetY = (e.clientY - centerY) / (window.innerHeight * 0.5);
    });

    // Responsive resize
    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth head & eye interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // 1. Natural Breathing Idle Animation
    const breathingOffset = Math.sin(time * 1.8) * 0.015;
    if (this.torso) this.torso.position.y = 0.55 + breathingOffset;
    if (this.neck) this.neck.position.y = 1.05 + breathingOffset * 1.2;
    if (this.headGroup) this.headGroup.position.y = 1.28 + breathingOffset * 1.4;

    // 2. Head Tracking towards User
    if (this.headGroup) {
      const targetRotY = this.mouse.x * 0.35 + Math.sin(time * 0.5) * 0.03;
      const targetRotX = this.mouse.y * 0.25 + Math.cos(time * 0.8) * 0.02;
      this.headGroup.rotation.y += (targetRotY - this.headGroup.rotation.y) * 0.08;
      this.headGroup.rotation.x += (targetRotX - this.headGroup.rotation.x) * 0.08;
      this.headGroup.rotation.z = -this.mouse.x * 0.05;
    }

    // 3. Eye Gaze Tracking
    this.eyes.forEach(eye => {
      eye.rotation.y = this.mouse.x * 0.35;
      eye.rotation.x = this.mouse.y * 0.25;
    });

    // 4. Blinking Mechanism
    this.blinkTimer += delta;
    if (this.blinkTimer >= this.nextBlinkTime) {
      // Execute blink
      const blinkProgress = Math.sin((this.blinkTimer - this.nextBlinkTime) * Math.PI * 6);
      if (blinkProgress > 0) {
        this.eyelids.forEach(lid => {
          lid.rotation.x = -Math.PI * 0.45 + blinkProgress * 0.65;
        });
      } else {
        // Blink finished
        this.eyelids.forEach(lid => { lid.rotation.x = -Math.PI * 0.45; });
        this.blinkTimer = 0;
        this.nextBlinkTime = 2.5 + Math.random() * 3.5;
      }
    }

    // 5. Lip-Sync / Speaking Animation
    if (this.isSpeaking) {
      const mouthOpen = Math.abs(Math.sin(time * 14)) * 0.025 + 0.01;
      const mouthWide = Math.cos(time * 8) * 0.02 + 0.08;
      if (this.mouth) {
        this.mouth.scale.set(mouthWide / 0.08, mouthOpen / 0.02, 1);
      }
      if (this.speechTimer > 0) {
        this.speechTimer -= delta;
        if (this.speechTimer <= 0) {
          this.isSpeaking = false;
          if (this.captionsEl) this.captionsEl.classList.remove('speaking');
        }
      }
    } else {
      if (this.mouth) {
        // Return to natural soft smile
        this.mouth.scale.set(1, 1, 1);
      }
    }

    // 6. Subtle Torso Sway
    if (this.characterGroup) {
      this.characterGroup.rotation.y = Math.sin(time * 0.8) * 0.04;
    }

    this.renderer.render(this.scene, this.camera);
  }

  showFallback(msg) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="avatar-fallback">
        <div class="avatar-fallback-emoji">👩‍🍳</div>
        <p style="color:var(--color-gold-antique); font-size:12px; margin-top:8px;">Veni Host Active</p>
      </div>
    `;
  }
}
