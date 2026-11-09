/**
 * VENI DELIGHTS — 3D INTERACTIVE DESSERT SHOWCASE & 360 ROTATOR
 * Three.js 3D Turntable with procedural realistic cakes, layer inspection,
 * interactive ingredient hotspots, and lighting controls.
 */

import * as THREE from 'three';

export class DessertShowcase3D {
  constructor(containerId = 'dessert-3d-stage') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.activeCake = 'butter'; // 'butter' | 'pandan' | 'pavlova' | 'brownie'
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
    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.set(0, 1.8, 3.2);
    this.camera.lookAt(0, 0.25, 0);

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
    // Ambient warm glow
    const ambient = new THREE.AmbientLight(0xfff3e0, 0.9);
    this.scene.add(ambient);

    // Warm Key Light (Spotlight on cake)
    this.spotlight = new THREE.SpotLight(0xffecd2, 3.5, 12, Math.PI / 4, 0.4, 1);
    this.spotlight.position.set(2, 4, 2.5);
    this.spotlight.castShadow = true;
    this.spotlight.shadow.mapSize.width = 1024;
    this.spotlight.shadow.mapSize.height = 1024;
    this.scene.add(this.spotlight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.8);
    fillLight.position.set(-2.5, 2, 1.5);
    this.scene.add(fillLight);

    // Luxury Golden Backlight / Rim
    const rimLight = new THREE.DirectionalLight(0xc9a84c, 2.5);
    rimLight.position.set(0, 2.5, -2.5);
    this.scene.add(rimLight);
  }

  buildPedestal() {
    this.pedestalGroup = new THREE.Group();
    this.scene.add(this.pedestalGroup);

    // Marble Plate
    const plateGeo = new THREE.CylinderGeometry(1.05, 1.0, 0.08, 64);
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x181816, // Black obsidian marble
      roughness: 0.15,
      metalness: 0.2,
    });
    const plate = new THREE.Mesh(plateGeo, marbleMat);
    plate.position.y = -0.04;
    plate.receiveShadow = true;
    this.pedestalGroup.add(plate);

    // Gold Trim Ring
    const goldRingGeo = new THREE.TorusGeometry(1.02, 0.025, 16, 64);
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
      case 'butter':   this.createButterCakeMesh(); break;
      case 'pandan':   this.createPandanLayerMesh(); break;
      case 'pavlova':  this.createPavlovaMesh(); break;
      case 'brownie':  this.createBrownieTowerMesh(); break;
    }
  }

  createButterCakeMesh() {
    // 2-Tier Golden Butter Cake
    const spongeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6b566, // Golden buttery yellow
      roughness: 0.7,
      sheen: 0.2,
      sheenColor: new THREE.Color(0xffde88),
    });

    const glazeMat = new THREE.MeshPhysicalMaterial({
      color: 0xffd175,
      roughness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      sheen: 0.4,
    });

    // Bottom Tier
    const tier1Geo = new THREE.CylinderGeometry(0.75, 0.75, 0.42, 64);
    const tier1 = new THREE.Mesh(tier1Geo, spongeMat);
    tier1.position.y = 0.21;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    this.cakeGroup.add(tier1);

    // Top Tier
    const tier2Geo = new THREE.CylinderGeometry(0.48, 0.48, 0.38, 64);
    const tier2 = new THREE.Mesh(tier2Geo, spongeMat);
    tier2.position.y = 0.61;
    tier2.castShadow = true;
    this.cakeGroup.add(tier2);

    // Glaze Top Crown
    const crownGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.03, 64);
    const crown = new THREE.Mesh(crownGeo, glazeMat);
    crown.position.y = 0.81;
    this.cakeGroup.add(crown);

    // Gold Leaf Flakes on top
    for (let i = 0; i < 18; i++) {
      const flakeGeo = new THREE.PlaneGeometry(0.04, 0.04);
      const goldLeafMat = new THREE.MeshStandardMaterial({
        color: 0xf0c860,
        roughness: 0.2,
        metalness: 0.95,
        side: THREE.DoubleSide
      });
      const flake = new THREE.Mesh(flakeGeo, goldLeafMat);
      const angle = (i / 18) * Math.PI * 2;
      const radius = Math.random() * 0.38 + 0.05;
      flake.position.set(Math.cos(angle) * radius, 0.83, Math.sin(angle) * radius);
      flake.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
      flake.rotation.y = Math.random() * Math.PI;
      this.cakeGroup.add(flake);
    }
  }

  createPandanLayerMesh() {
    // Layered Pandan Cake with green sponge and creamy custard layers
    const pandanSponge = new THREE.MeshStandardMaterial({ color: 0x5a9e52, roughness: 0.8 });
    const pandanCustard = new THREE.MeshPhysicalMaterial({ color: 0x7ebd6d, roughness: 0.2, clearcoat: 0.6 });

    // Alternating 5 layers
    for (let layer = 0; layer < 5; layer++) {
      const isCustard = layer % 2 === 1;
      const layerGeo = new THREE.CylinderGeometry(0.72, 0.72, 0.12, 64);
      const layerMesh = new THREE.Mesh(layerGeo, isCustard ? pandanCustard : pandanSponge);
      layerMesh.position.y = 0.06 + layer * 0.12;
      layerMesh.castShadow = true;
      this.cakeGroup.add(layerMesh);
    }
  }

  createPavlovaMesh() {
    // Meringue base
    const meringueMat = new THREE.MeshPhysicalMaterial({
      color: 0xfdfaf5,
      roughness: 0.6,
      clearcoat: 0.2
    });
    const baseGeo = new THREE.CylinderGeometry(0.75, 0.82, 0.4, 64);
    const base = new THREE.Mesh(baseGeo, meringueMat);
    base.position.y = 0.2;
    base.castShadow = true;
    this.cakeGroup.add(base);

    // Whipped Cream Cloud
    const creamMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.3, clearcoat: 0.5 });
    const creamGeo = new THREE.SphereGeometry(0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cream = new THREE.Mesh(creamGeo, creamMat);
    cream.position.y = 0.4;
    cream.scale.set(1.0, 0.35, 1.0);
    this.cakeGroup.add(cream);

    // Fresh Strawberries on Top
    const berryMat = new THREE.MeshPhysicalMaterial({ color: 0xd62828, roughness: 0.2, clearcoat: 0.9 });
    for (let i = 0; i < 9; i++) {
      const berryGeo = new THREE.ConeGeometry(0.08, 0.15, 16);
      const berry = new THREE.Mesh(berryGeo, berryMat);
      const angle = (i / 9) * Math.PI * 2;
      berry.position.set(Math.cos(angle) * 0.4, 0.55, Math.sin(angle) * 0.4);
      berry.rotation.x = (Math.random() - 0.5) * 0.4;
      berry.rotation.z = (Math.random() - 0.5) * 0.4;
      this.cakeGroup.add(berry);
    }
  }

  createBrownieTowerMesh() {
    // Fudgy Brownie Cubes Stacked into an Artisan Tower
    const brownieMat = new THREE.MeshStandardMaterial({ color: 0x24140c, roughness: 0.85 });
    const ganacheMat = new THREE.MeshPhysicalMaterial({ color: 0x140a06, roughness: 0.1, clearcoat: 0.95 });

    // Level 1: 4 large blocks
    for (let r = -1; r <= 1; r += 2) {
      for (let c = -1; c <= 1; c += 2) {
        const blockGeo = new THREE.BoxGeometry(0.45, 0.18, 0.45);
        const block = new THREE.Mesh(blockGeo, brownieMat);
        block.position.set(r * 0.26, 0.09, c * 0.26);
        block.rotation.y = (Math.random() - 0.5) * 0.2;
        block.castShadow = true;
        this.cakeGroup.add(block);
      }
    }

    // Level 2: 2 medium blocks turned 45 degrees
    const top1 = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.18, 0.48), brownieMat);
    top1.position.y = 0.27;
    top1.rotation.y = Math.PI / 4;
    this.cakeGroup.add(top1);

    // Top Ganache Drip
    const topDrip = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.04, 32), ganacheMat);
    topDrip.position.y = 0.38;
    this.cakeGroup.add(topDrip);
  }

  setupControlsUI() {
    const ui = document.createElement('div');
    ui.className = 'showcase-3d-ui';
    ui.innerHTML = `
      <div class="showcase-cake-switcher" role="tablist" aria-label="Select 3D Cake Model">
        <button class="showcase-tab-btn active" data-cake="butter">Pure Butter</button>
        <button class="showcase-tab-btn" data-cake="pandan">Pandan Layer</button>
        <button class="showcase-tab-btn" data-cake="pavlova">Pavlova</button>
        <button class="showcase-tab-btn" data-cake="brownie">Brownie Tower</button>
      </div>

      <div class="showcase-hud-controls">
        <button class="showcase-control-btn" id="showcase-autorotate-btn" title="Toggle Auto Rotation">
          <i class="fa-solid fa-arrows-rotate"></i> <span>360° Rotate: ON</span>
        </button>
        <div class="showcase-drag-hint">
          <i class="fa-solid fa-hand-pointer"></i> <span>Drag to inspect 360°</span>
        </div>
      </div>
    `;

    this.container.appendChild(ui);

    // Bind tab clicks
    ui.querySelectorAll('.showcase-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        ui.querySelectorAll('.showcase-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCake = btn.dataset.cake;
        this.buildCake();
      });
    });

    // Auto rotate toggle
    const rotBtn = ui.querySelector('#showcase-autorotate-btn');
    rotBtn.addEventListener('click', () => {
      this.autoRotate = !this.autoRotate;
      rotBtn.innerHTML = this.autoRotate
        ? '<i class="fa-solid fa-arrows-rotate"></i> <span>360° Rotate: ON</span>'
        : '<i class="fa-solid fa-pause"></i> <span>360° Rotate: OFF</span>';
    });
  }

  bindEvents() {
    const canvas = this.renderer.domElement;

    // Mouse / Touch Drag to Rotate Cake
    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging || !this.cakeGroup) return;

      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

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

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener('touchend', onPointerUp);

    // Resize
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

    // Auto turntable rotation
    if (this.autoRotate && !this.isDragging) {
      if (this.cakeGroup) this.cakeGroup.rotation.y += delta * 0.45;
      if (this.pedestalGroup) this.pedestalGroup.rotation.y += delta * 0.45;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
