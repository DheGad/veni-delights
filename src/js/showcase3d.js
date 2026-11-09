/**
 * VENI DELIGHTS — 3D INTERACTIVE DESSERT SHOWCASE & 360 TURNTABLE
 * Three.js 3D Turntable with procedural realistic cakes, layer inspection,
 * interactive multi-cake dock, and direct WhatsApp commerce link.
 */

import * as THREE from 'three';

export const CAKE_MODELS_DATA = {
  butter: {
    name: 'Pure Butter Cake',
    price: 'RM79',
    badge: 'Signature Best-Seller',
    desc: '100% pure butter sponge with golden caramel glaze and edible gold leaf.',
    waText: 'Hello Veni Delights! I would like to order the Pure Butter Cake (RM79).'
  },
  pandan: {
    name: 'Pandan Layer Cake',
    price: '8" RM69 • 10" RM89',
    badge: '100% Natural Pandan',
    desc: 'Five alternating layers of pandan sponge and creamy coconut custard.',
    waText: 'Hello Veni Delights! I would like to order the Pandan Layer Cake.'
  },
  pavlova: {
    name: 'Pavlova Pudding Cake',
    price: 'RM88',
    badge: '5 Fruit Flavours',
    desc: 'Delicate crisp meringue base with whipped cream and glazed fresh berries.',
    waText: 'Hello Veni Delights! I would like to order the Pavlova Pudding Cake (RM88).'
  },
  brownie: {
    name: 'Fudgy Brownie Tower',
    price: 'RM59',
    badge: 'Fresh Daily',
    desc: 'Decadent chocolate fudge blocks stacked with glossy ganache drip.',
    waText: 'Hello Veni Delights! I would like to order the Premium Brownies (RM59).'
  },
  cheesetart: {
    name: 'Signature Cheese Tarts',
    price: 'From RM2.50 / pc',
    badge: 'Vegetarian Friendly',
    desc: 'Crisp golden pastry crust filled with rich, creamy molten baked cheese.',
    waText: 'Hello Veni Delights! I would like to order the Signature Cheese Tarts (Min 10 pcs).'
  }
};

export class DessertShowcase3D {
  constructor(containerId = 'hero-3d-stage') {
    this.container = document.getElementById(containerId) || document.getElementById('hero-3d-stage') || document.getElementById('dessert-3d-stage');
    if (!this.container) return;

    this.activeCake = 'butter';
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.autoRotate = true;
    this.clock = new THREE.Clock();

    this.init();
  }

  init() {
    this.setupScene();
    this.setupLights();
    this.buildPedestal();
    this.buildCake();
    this.setupControlsUI();
    this.bindEvents();
    this.animate();
  }

  setupScene() {
    const width = this.container.clientWidth || 540;
    const height = this.container.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    this.camera.position.set(0, 1.85, 3.3);
    this.camera.lookAt(0, 0.28, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    const ambient = new THREE.AmbientLight(0xfff5e8, 0.9);
    this.scene.add(ambient);

    // Warm Spotlight on cake
    this.spotlight = new THREE.SpotLight(0xffecd2, 3.8, 14, Math.PI / 4, 0.35, 1);
    this.spotlight.position.set(2, 4.5, 2.5);
    this.spotlight.castShadow = true;
    this.spotlight.shadow.mapSize.width = 1024;
    this.spotlight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotlight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xdce7f0, 0.85);
    fillLight.position.set(-2.5, 2, 1.5);
    this.scene.add(fillLight);

    // Luxury Golden Backlight / Rim
    const rimLight = new THREE.DirectionalLight(0xc9a84c, 2.8);
    rimLight.position.set(0, 2.8, -2.5);
    this.scene.add(rimLight);
  }

  buildPedestal() {
    this.pedestalGroup = new THREE.Group();
    this.scene.add(this.pedestalGroup);

    // Marble Plate
    const plateGeo = new THREE.CylinderGeometry(1.1, 1.05, 0.09, 64);
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x141412,
      roughness: 0.18,
      metalness: 0.25,
    });
    const plate = new THREE.Mesh(plateGeo, marbleMat);
    plate.position.y = -0.045;
    plate.receiveShadow = true;
    this.pedestalGroup.add(plate);

    // Gold Trim Ring
    const goldRingGeo = new THREE.TorusGeometry(1.08, 0.025, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.2,
      metalness: 0.9,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.0;
    this.pedestalGroup.add(goldRing);
  }

  buildCake() {
    if (this.cakeGroup) {
      this.scene.remove(this.cakeGroup);
    }

    this.cakeGroup = new THREE.Group();
    this.cakeGroup.position.y = 0.0;
    this.scene.add(this.cakeGroup);

    switch (this.activeCake) {
      case 'butter':      this.createButterCakeMesh(); break;
      case 'pandan':      this.createPandanLayerMesh(); break;
      case 'pavlova':     this.createPavlovaMesh(); break;
      case 'brownie':     this.createBrownieTowerMesh(); break;
      case 'cheesetart':  this.createCheeseTartMesh(); break;
    }

    this.updateCardInfo();
  }

  createButterCakeMesh() {
    const spongeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6b566,
      roughness: 0.7,
      sheen: 0.25,
      sheenColor: new THREE.Color(0xffde88),
    });

    const glazeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd175,
      roughness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      sheen: 0.4,
    });

    // Tier 1
    const tier1Geo = new THREE.CylinderGeometry(0.78, 0.78, 0.44, 64);
    const tier1 = new THREE.Mesh(tier1Geo, spongeMat);
    tier1.position.y = 0.22;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    this.cakeGroup.add(tier1);

    // Tier 2
    const tier2Geo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 64);
    const tier2 = new THREE.Mesh(tier2Geo, spongeMat);
    tier2.position.y = 0.64;
    tier2.castShadow = true;
    this.cakeGroup.add(tier2);

    // Glaze Top Crown
    const crownGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.035, 64);
    const crown = new THREE.Mesh(crownGeo, glazeMat);
    crown.position.y = 0.85;
    this.cakeGroup.add(crown);

    // Gold Leaf Flakes
    for (let i = 0; i < 20; i++) {
      const flakeGeo = new THREE.PlaneGeometry(0.045, 0.045);
      const goldLeafMat = new THREE.MeshStandardMaterial({
        color: 0xf0c860,
        roughness: 0.2,
        metalness: 0.95,
        side: THREE.DoubleSide
      });
      const flake = new THREE.Mesh(flakeGeo, goldLeafMat);
      const angle = (i / 20) * Math.PI * 2;
      const radius = Math.random() * 0.4 + 0.05;
      flake.position.set(Math.cos(angle) * radius, 0.87, Math.sin(angle) * radius);
      flake.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      flake.rotation.y = Math.random() * Math.PI;
      this.cakeGroup.add(flake);
    }
  }

  createPandanLayerMesh() {
    const pandanSponge = new THREE.MeshStandardMaterial({ color: 0x5a9e52, roughness: 0.8 });
    const pandanCustard = new THREE.MeshPhysicalMaterial({ color: 0x7ebd6d, roughness: 0.2, clearcoat: 0.6 });

    for (let layer = 0; layer < 5; layer++) {
      const isCustard = layer % 2 === 1;
      const layerGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.13, 64);
      const layerMesh = new THREE.Mesh(layerGeo, isCustard ? pandanCustard : pandanSponge);
      layerMesh.position.y = 0.065 + layer * 0.13;
      layerMesh.castShadow = true;
      this.cakeGroup.add(layerMesh);
    }
  }

  createPavlovaMesh() {
    const meringueMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdfaf5,
      roughness: 0.6,
      clearcoat: 0.2
    });
    const baseGeo = new THREE.CylinderGeometry(0.78, 0.85, 0.42, 64);
    const base = new THREE.Mesh(baseGeo, meringueMat);
    base.position.y = 0.21;
    base.castShadow = true;
    this.cakeGroup.add(base);

    const creamMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.5 });
    const creamGeo = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cream = new THREE.Mesh(creamGeo, creamMat);
    cream.position.y = 0.42;
    cream.scale.set(1.0, 0.35, 1.0);
    this.cakeGroup.add(cream);

    const berryMat = new THREE.MeshPhysicalMaterial({ color: 0xd62828, roughness: 0.2, clearcoat: 0.9 });
    for (let i = 0; i < 9; i++) {
      const berryGeo = new THREE.ConeGeometry(0.08, 0.16, 16);
      const berry = new THREE.Mesh(berryGeo, berryMat);
      const angle = (i / 9) * Math.PI * 2;
      berry.position.set(Math.cos(angle) * 0.42, 0.58, Math.sin(angle) * 0.42);
      berry.rotation.x = (Math.random() - 0.5) * 0.4;
      berry.rotation.z = (Math.random() - 0.5) * 0.4;
      this.cakeGroup.add(berry);
    }
  }

  createBrownieTowerMesh() {
    const brownieMat = new THREE.MeshStandardMaterial({ color: 0x24140c, roughness: 0.85 });
    const ganacheMat = new THREE.MeshPhysicalMaterial({ color: 0x140a06, roughness: 0.1, clearcoat: 0.95 });

    for (let r = -1; r <= 1; r += 2) {
      for (let c = -1; c <= 1; c += 2) {
        const blockGeo = new THREE.BoxGeometry(0.48, 0.2, 0.48);
        const block = new THREE.Mesh(blockGeo, brownieMat);
        block.position.set(r * 0.27, 0.1, c * 0.27);
        block.rotation.y = (Math.random() - 0.5) * 0.2;
        block.castShadow = true;
        this.cakeGroup.add(block);
      }
    }

    const top1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.5), brownieMat);
    top1.position.y = 0.3;
    top1.rotation.y = Math.PI / 4;
    this.cakeGroup.add(top1);

    const topDrip = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.34, 0.04, 32), ganacheMat);
    topDrip.position.y = 0.42;
    this.cakeGroup.add(topDrip);
  }

  createCheeseTartMesh() {
    // 1. Pastry Shell
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xc89452,
      roughness: 0.85
    });
    const shellGeo = new THREE.CylinderGeometry(0.82, 0.62, 0.34, 64);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 0.17;
    shell.castShadow = true;
    this.cakeGroup.add(shell);

    // Fluted edge rim
    const rimGeo = new THREE.TorusGeometry(0.82, 0.045, 16, 64);
    const rim = new THREE.Mesh(rimGeo, shellMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.34;
    this.cakeGroup.add(rim);

    // 2. Creamy Baked Cheese Filling
    const cheeseMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff6dd,
      roughness: 0.3,
      clearcoat: 0.5,
      sheen: 0.2
    });
    const fillingGeo = new THREE.SphereGeometry(0.76, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const filling = new THREE.Mesh(fillingGeo, cheeseMat);
    filling.position.y = 0.3;
    this.cakeGroup.add(filling);

    // 3. Glazed Fruit / Blueberry Compote Swirl
    const swirlMat = new THREE.MeshPhysicalMaterial({
      color: 0x3d1c47,
      roughness: 0.1,
      clearcoat: 0.95
    });
    for (let i = 0; i < 7; i++) {
      const berryGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const berry = new THREE.Mesh(berryGeo, swirlMat);
      const angle = (i / 7) * Math.PI * 2;
      const radius = 0.34;
      berry.position.set(Math.cos(angle) * radius, 0.48, Math.sin(angle) * radius);
      this.cakeGroup.add(berry);
    }
  }

  setupControlsUI() {
    const ui = document.createElement('div');
    ui.className = 'hero-3d-ui-overlay';
    ui.innerHTML = `
      <div class="hero-3d-info-card" id="hero-3d-info-card">
        <span class="badge badge-gold" id="hero-3d-badge">Signature Best-Seller</span>
        <h3 class="hero-3d-name" id="hero-3d-name">Pure Butter Cake</h3>
        <p class="hero-3d-desc" id="hero-3d-desc">100% pure butter sponge with golden caramel glaze and edible gold leaf.</p>
        <div class="hero-3d-price-row">
          <span class="hero-3d-price" id="hero-3d-price">RM79</span>
          <a href="#" id="hero-3d-wa-btn" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp"></i> Order Now
          </a>
        </div>
      </div>

      <div class="hero-3d-cake-dock" role="tablist" aria-label="Select 3D Cake Model">
        <button class="cake-dock-btn active" data-cake="butter" title="Pure Butter Cake">
          <span class="dock-icon">🎂</span>
          <span class="dock-label">Butter</span>
        </button>
        <button class="cake-dock-btn" data-cake="pandan" title="Pandan Layer Cake">
          <span class="dock-icon">🌿</span>
          <span class="dock-label">Pandan</span>
        </button>
        <button class="cake-dock-btn" data-cake="pavlova" title="Pavlova Pudding">
          <span class="dock-icon">🍓</span>
          <span class="dock-label">Pavlova</span>
        </button>
        <button class="cake-dock-btn" data-cake="brownie" title="Brownies">
          <span class="dock-icon">🍫</span>
          <span class="dock-label">Brownies</span>
        </button>
        <button class="cake-dock-btn" data-cake="cheesetart" title="Cheese Tarts">
          <span class="dock-icon">🧀</span>
          <span class="dock-label">Tarts</span>
        </button>
      </div>

      <div class="hero-3d-hint">
        <i class="fa-solid fa-arrows-rotate"></i>
        <span>Drag 360° to inspect</span>
      </div>
    `;

    this.container.appendChild(ui);
    this.uiOverlay = ui;

    // Bind dock clicks
    ui.querySelectorAll('.cake-dock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ui.querySelectorAll('.cake-dock-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCake = btn.dataset.cake;
        this.buildCake();
      });
    });

    this.updateCardInfo();
  }

  updateCardInfo() {
    if (!this.uiOverlay) return;
    const data = CAKE_MODELS_DATA[this.activeCake];
    if (!data) return;

    const badgeEl = this.uiOverlay.querySelector('#hero-3d-badge');
    const nameEl = this.uiOverlay.querySelector('#hero-3d-name');
    const descEl = this.uiOverlay.querySelector('#hero-3d-desc');
    const priceEl = this.uiOverlay.querySelector('#hero-3d-price');
    const waBtn = this.uiOverlay.querySelector('#hero-3d-wa-btn');

    if (badgeEl) badgeEl.textContent = data.badge;
    if (nameEl) nameEl.textContent = data.name;
    if (descEl) descEl.textContent = data.desc;
    if (priceEl) priceEl.textContent = data.price;
    if (waBtn) {
      waBtn.href = `https://wa.me/60123360470?text=${encodeURIComponent(data.waText)}`;
    }
  }

  bindEvents() {
    const canvas = this.renderer.domElement;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging || !this.cakeGroup) return;

      const deltaX = clientX - this.previousMousePosition.x;
      this.cakeGroup.rotation.y += deltaX * 0.01;
      this.pedestalGroup.rotation.y += deltaX * 0.01;

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

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

    if (this.autoRotate && !this.isDragging) {
      if (this.cakeGroup) this.cakeGroup.rotation.y += delta * 0.45;
      if (this.pedestalGroup) this.pedestalGroup.rotation.y += delta * 0.45;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
