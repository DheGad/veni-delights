/**
 * VENI DELIGHTS — 3D ADVANCED ULTRA-REALISTIC DESSERT SHOWCASE & 360 TURNTABLE
 * High-fidelity Three.js turntable with:
 * - Procedural realistic bakery textures (porous sponge crumb, caramel glaze drips, torched brulee scorch)
 * - Handcrafted realistic toppings (fresh glossy strawberries, calyx leaves, blueberries, gold foil flakes)
 * - 5 Signature Cakes: Pure Butter, Pandan Layer, Pavlova Pudding, Brownie Tower, Molten Cheese Tart
 * - Interactive Controls: 360° Drag, Auto-Spin Toggle, Zoom In/Out, Cut Slice / Inspect Layers View
 * - Orbiting floating 24K gold sparkle particles
 * - Zero-Lag IntersectionObserver: 0% idle CPU when scrolled out of viewport
 */

import * as THREE from 'three';

export const CAKE_MODELS_DATA = {
  butter: {
    name: 'Pure Butter Cake',
    price: 'RM79',
    badge: 'Signature Best-Seller',
    desc: '100% pure European dairy butter sponge with poured salted caramel glaze, fresh strawberry crown, and 24k edible gold leaf.',
    waText: 'Hello Veni Delights! I would like to order the Signature Pure Butter Cake (RM79).'
  },
  pandan: {
    name: 'Pandan Layer Cake',
    price: '8" RM69 • 10" RM89',
    badge: '100% Natural Pandan Suji',
    desc: 'Five alternating layers of fragrant pandan sponge and creamy coconut agar-agar custard, made with 100% fresh pandan leaves.',
    waText: 'Hello Veni Delights! I would like to order the Pandan Layer Cake.'
  },
  pavlova: {
    name: 'Pavlova Pudding Cake',
    price: 'RM88',
    badge: 'Fresh Fruit Medley',
    desc: 'Crisp French meringue shell crowned with velvety Chantilly whipped cream, fresh strawberries, and glazed blueberries.',
    waText: 'Hello Veni Delights! I would like to order the Pavlova Pudding Cake (RM88).'
  },
  brownie: {
    name: 'Fudgy Brownie Tower',
    price: 'RM59',
    badge: '72% Dark Cocoa',
    desc: 'Decadent Valrhona dark chocolate fudge blocks stacked high with warm molten ganache drip and roasted golden hazelnuts.',
    waText: 'Hello Veni Delights! I would like to order the Premium Brownie Tower (RM59).'
  },
  cheesetart: {
    name: 'Signature Molten Cheese Tarts',
    price: 'From RM2.50 / pc',
    badge: 'Baked Fresh to Order',
    desc: 'Crisp French sablé shortcrust basket filled with bubbling Hokkaido cream cheese custard and a molten oozing lava core.',
    waText: 'Hello Veni Delights! I would like to order the Signature Molten Cheese Tarts (Min 10 pcs).'
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
    this.isSliced = false;
    this.zoomLevel = 1.0;
    this.isVisible = true;
    this.clock = new THREE.Clock();

    // Procedural texture canvas cache
    this.textures = {};

    this.init();
  }

  init() {
    this.createProceduralTextures();
    this.setupScene();
    this.setupLights();
    this.buildPedestal();
    this.buildGoldSparkles();
    this.buildCake();
    this.setupControlsUI();
    this.bindEvents();
    this.setupVisibilityObserver();
    this.animate();
  }

  createProceduralTextures() {
    // 1. Crumb porous bump texture
    const crumbCanvas = document.createElement('canvas');
    crumbCanvas.width = 256;
    crumbCanvas.height = 256;
    const cCtx = crumbCanvas.getContext('2d');
    cCtx.fillStyle = '#b08a52';
    cCtx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 256;
      const y = Math.random() * 256;
      const r = Math.random() * 2.2 + 0.5;
      cCtx.fillStyle = Math.random() > 0.5 ? '#805d28' : '#e6be77';
      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.fill();
    }
    this.textures.crumb = new THREE.CanvasTexture(crumbCanvas);
    this.textures.crumb.wrapS = THREE.RepeatWrapping;
    this.textures.crumb.wrapT = THREE.RepeatWrapping;
    this.textures.crumb.repeat.set(3, 3);

    // 2. Torched brulee scorch marks (for cheese tart dome)
    const bruleeCanvas = document.createElement('canvas');
    bruleeCanvas.width = 256;
    bruleeCanvas.height = 256;
    const bCtx = bruleeCanvas.getContext('2d');
    bCtx.fillStyle = '#fcefd2';
    bCtx.fillRect(0, 0, 256, 256);
    // Draw golden brown scorch spots
    const spots = [
      { x: 128, y: 128, r: 48, c: 'rgba(150, 85, 25, 0.75)' },
      { x: 145, y: 110, r: 35, c: 'rgba(105, 50, 15, 0.85)' },
      { x: 95, y: 140, r: 28, c: 'rgba(170, 105, 35, 0.65)' },
      { x: 155, y: 150, r: 24, c: 'rgba(195, 130, 45, 0.6)' }
    ];
    spots.forEach(s => {
      const grad = bCtx.createRadialGradient(s.x, s.y, 2, s.x, s.y, s.r);
      grad.addColorStop(0, s.c);
      grad.addColorStop(0.6, 'rgba(215, 155, 60, 0.4)');
      grad.addColorStop(1, 'rgba(252, 239, 210, 0)');
      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      bCtx.fill();
    });
    this.textures.brulee = new THREE.CanvasTexture(bruleeCanvas);
  }

  setupScene() {
    const width = this.container.clientWidth || 540;
    const height = this.container.clientHeight || 500;
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    const fov = isMobile ? 36 : 32;
    this.camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 100);
    this.baseCameraPos = isMobile
      ? new THREE.Vector3(0, 2.15, 4.15)
      : new THREE.Vector3(0, 1.82, 3.35);
    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(0, isMobile ? 0.45 : 0.32, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Ambient Patisserie Warm Light
    const ambient = new THREE.AmbientLight(0xfff5e8, 1.1);
    this.scene.add(ambient);

    // Warm Studio Key Spotlight (creates glossy highlights on glazes)
    this.spotlight = new THREE.SpotLight(0xffecd2, 4.2, 16, Math.PI / 3.8, 0.35, 1.2);
    this.spotlight.position.set(2.2, 4.8, 2.8);
    this.spotlight.castShadow = true;
    this.spotlight.shadow.mapSize.width = 1024;
    this.spotlight.shadow.mapSize.height = 1024;
    this.spotlight.shadow.bias = -0.001;
    this.scene.add(this.spotlight);

    // Soft Champagne Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbe6f2, 1.0);
    fillLight.position.set(-2.8, 2.2, 1.8);
    this.scene.add(fillLight);

    // 24K Gold Specular Rim Light (creates signature luxury gold halo)
    const rimLight = new THREE.DirectionalLight(0xf0c860, 3.5);
    rimLight.position.set(0, 3.0, -2.8);
    this.scene.add(rimLight);
  }

  buildPedestal() {
    this.pedestalGroup = new THREE.Group();
    this.scene.add(this.pedestalGroup);

    // 1. Nero Marquina Black Marble Base
    const plateGeo = new THREE.CylinderGeometry(1.15, 1.18, 0.09, 64);
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x141211,
      roughness: 0.16,
      metalness: 0.35,
    });
    const plate = new THREE.Mesh(plateGeo, marbleMat);
    plate.position.y = -0.045;
    plate.receiveShadow = true;
    this.pedestalGroup.add(plate);

    // 2. Bevelled 24K Gold Trim Ring
    const goldRingGeo = new THREE.TorusGeometry(1.14, 0.024, 20, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd5ae61,
      roughness: 0.18,
      metalness: 0.95,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.0;
    this.pedestalGroup.add(goldRing);

    // 3. Inner Decorative Gold Inlay Ring
    const innerRingGeo = new THREE.TorusGeometry(0.85, 0.012, 16, 64);
    const innerRing = new THREE.Mesh(innerRingGeo, goldMat);
    innerRing.rotation.x = Math.PI / 2;
    innerRing.position.y = 0.002;
    this.pedestalGroup.add(innerRing);
  }

  buildGoldSparkles() {
    // 120 orbiting floating gold dust particles
    const count = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 0.4 + Math.random() * 0.9;
      const angle = Math.random() * Math.PI * 2;
      const y = Math.random() * 1.4 + 0.1;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      scales[i] = Math.random() * 0.6 + 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0xf5d372,
      size: 0.035,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.sparkles = new THREE.Points(geometry, material);
    this.scene.add(this.sparkles);
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

  createStrawberryModel(x, y, z, scale = 1.0) {
    const strawberryGroup = new THREE.Group();
    strawberryGroup.position.set(x, y, z);
    strawberryGroup.scale.set(scale, scale, scale);

    // 1. Glossy Berry Body
    const berryGeo = new THREE.ConeGeometry(0.12, 0.22, 32);
    const berryMat = new THREE.MeshPhysicalMaterial({
      color: 0xb81d2f,
      roughness: 0.18,
      clearcoat: 0.92,
      clearcoatRoughness: 0.1,
      sheen: 0.4,
      sheenColor: new THREE.Color(0xff5566)
    });
    const berry = new THREE.Mesh(berryGeo, berryMat);
    berry.rotation.x = Math.PI;
    berry.castShadow = true;
    strawberryGroup.add(berry);

    // 2. Green Calyx Leaves
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x2e6b2c,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    for (let i = 0; i < 5; i++) {
      const leafGeo = new THREE.ConeGeometry(0.035, 0.08, 3);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      const angle = (i / 5) * Math.PI * 2;
      leaf.position.set(Math.cos(angle) * 0.05, 0.11, Math.sin(angle) * 0.05);
      leaf.rotation.z = Math.cos(angle) * 0.5;
      leaf.rotation.x = -Math.sin(angle) * 0.5;
      strawberryGroup.add(leaf);
    }

    return strawberryGroup;
  }

  createButterCakeMesh() {
    const spongeMat = new THREE.MeshPhysicalMaterial({
      color: 0xe6b566,
      bumpMap: this.textures.crumb,
      bumpScale: 0.015,
      roughness: 0.68,
      sheen: 0.35,
      sheenColor: new THREE.Color(0xffde88),
    });

    const glazeMat = new THREE.MeshPhysicalMaterial({
      color: 0xd99834,
      roughness: 0.08,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
      sheen: 0.5,
      sheenColor: new THREE.Color(0xffea9f)
    });

    // Tier 1 Base Sponge
    const tier1Geo = new THREE.CylinderGeometry(0.82, 0.84, 0.45, 64);
    const tier1 = new THREE.Mesh(tier1Geo, spongeMat);
    tier1.position.y = 0.225;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    this.cakeGroup.add(tier1);

    // Tier 2 Top Sponge
    const tier2Geo = new THREE.CylinderGeometry(0.56, 0.58, 0.38, 64);
    const tier2 = new THREE.Mesh(tier2Geo, spongeMat);
    tier2.position.y = 0.64;
    tier2.castShadow = true;
    this.cakeGroup.add(tier2);

    // Caramel Glaze Crown
    const crownGeo = new THREE.CylinderGeometry(0.58, 0.59, 0.045, 64);
    const crown = new THREE.Mesh(crownGeo, glazeMat);
    crown.position.y = 0.835;
    this.cakeGroup.add(crown);

    // Dripping Caramel Teardrops down Tier 2
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const dripHeight = 0.08 + Math.sin(i * 3.7) * 0.06;
      const dripGeo = new THREE.CylinderGeometry(0.016, 0.01, dripHeight, 16);
      const drip = new THREE.Mesh(dripGeo, glazeMat);
      drip.position.set(Math.cos(angle) * 0.575, 0.82 - dripHeight / 2, Math.sin(angle) * 0.575);
      this.cakeGroup.add(drip);

      // Droplet bulb at bottom of drip
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 12), glazeMat);
      bulb.position.set(Math.cos(angle) * 0.575, 0.82 - dripHeight, Math.sin(angle) * 0.575);
      this.cakeGroup.add(bulb);
    }

    // Whole Glossy Strawberry Crown Topper
    const topperStrawberry = this.createStrawberryModel(0, 0.95, 0, 1.1);
    this.cakeGroup.add(topperStrawberry);

    // Hand-Placed 24K Edible Gold Leaf Flakes
    const goldLeafMat = new THREE.MeshStandardMaterial({
      color: 0xf5d372,
      roughness: 0.15,
      metalness: 0.98,
      side: THREE.DoubleSide
    });
    for (let i = 0; i < 28; i++) {
      const flakeGeo = new THREE.PlaneGeometry(0.045, 0.045);
      const flake = new THREE.Mesh(flakeGeo, goldLeafMat);
      const angle = (i / 28) * Math.PI * 2;
      const radius = 0.15 + (i % 3) * 0.12;
      flake.position.set(Math.cos(angle) * radius, 0.865 + Math.random() * 0.01, Math.sin(angle) * radius);
      flake.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
      flake.rotation.y = Math.random() * Math.PI;
      this.cakeGroup.add(flake);
    }

    // Inspect Slice Mode
    if (this.isSliced) {
      // Pull out slice cutout
      tier1.position.x = 0.12;
      tier1.position.z = 0.12;
    }
  }

  createPandanLayerMesh() {
    const spongeMat = new THREE.MeshStandardMaterial({
      color: 0x4a8c3f,
      bumpMap: this.textures.crumb,
      bumpScale: 0.018,
      roughness: 0.72
    });

    const custardMat = new THREE.MeshPhysicalMaterial({
      color: 0x6db85b,
      roughness: 0.16,
      transmission: 0.32,
      thickness: 0.45,
      clearcoat: 0.65,
      clearcoatRoughness: 0.12,
      sheen: 0.3
    });

    // 5 alternating layers (sponge & coconut agar custard)
    for (let layer = 0; layer < 5; layer++) {
      const isCustard = layer % 2 === 1;
      const h = 0.125;
      const layerGeo = new THREE.CylinderGeometry(0.80, 0.80, h, 64);
      const layerMesh = new THREE.Mesh(layerGeo, isCustard ? custardMat : spongeMat);
      layerMesh.position.y = 0.0625 + layer * h;
      layerMesh.castShadow = true;
      this.cakeGroup.add(layerMesh);

      // Layer gap separator ring
      if (layer > 0) {
        const ringGeo = new THREE.TorusGeometry(0.802, 0.006, 8, 64);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0x3d7434, roughness: 0.5 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = layer * h;
        this.cakeGroup.add(ring);
      }
    }

    // Coconut Cream Top Glaze
    const creamCrownMat = new THREE.MeshPhysicalMaterial({
      color: 0xfffcf5,
      roughness: 0.22,
      clearcoat: 0.5
    });
    const creamCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.81, 0.81, 0.035, 64), creamCrownMat);
    creamCrown.position.y = 0.64;
    this.cakeGroup.add(creamCrown);

    // Fresh Pandan Leaves Topper Decoration
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2d6124, roughness: 0.4, side: THREE.DoubleSide });
    for (let i = 0; i < 3; i++) {
      const pLeaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.28, 4), leafMat);
      pLeaf.position.set((i - 1) * 0.12, 0.74, 0);
      pLeaf.rotation.z = (i - 1) * 0.35;
      this.cakeGroup.add(pLeaf);
    }
  }

  createPavlovaMesh() {
    // 1. Crisp Meringue Base with crags
    const meringueMat = new THREE.MeshPhysicalMaterial({
      color: 0xfbf7ed,
      roughness: 0.65,
      clearcoat: 0.15
    });
    const baseGeo = new THREE.CylinderGeometry(0.80, 0.88, 0.38, 64);
    const base = new THREE.Mesh(baseGeo, meringueMat);
    base.position.y = 0.19;
    base.castShadow = true;
    this.cakeGroup.add(base);

    // 2. Whipped Chantilly Cream Dome with soft swirl
    const creamMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.25,
      clearcoat: 0.55
    });
    const creamGeo = new THREE.SphereGeometry(0.74, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cream = new THREE.Mesh(creamGeo, creamMat);
    cream.position.y = 0.38;
    cream.scale.set(1.0, 0.36, 1.0);
    this.cakeGroup.add(cream);

    // 3. Medley of fresh fruits on top
    // Strawberries
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 0.44;
      const b = this.createStrawberryModel(Math.cos(angle) * r, 0.54, Math.sin(angle) * r, 0.72);
      b.rotation.z = Math.cos(angle) * 0.3;
      b.rotation.x = -Math.sin(angle) * 0.3;
      this.cakeGroup.add(b);
    }

    // Fresh Blueberries
    const blueberryMat = new THREE.MeshPhysicalMaterial({
      color: 0x22203d,
      roughness: 0.2,
      clearcoat: 0.95,
      sheen: 0.3,
      sheenColor: new THREE.Color(0x5555aa)
    });
    for (let j = 0; j < 10; j++) {
      const angle = (j / 10) * Math.PI * 2 + 0.3;
      const r = 0.26;
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 16), blueberryMat);
      berry.position.set(Math.cos(angle) * r, 0.55, Math.sin(angle) * r);
      this.cakeGroup.add(berry);
    }

    // Centerpiece Strawberry
    const centerBerry = this.createStrawberryModel(0, 0.62, 0, 0.9);
    this.cakeGroup.add(centerBerry);
  }

  createBrownieTowerMesh() {
    const brownieMat = new THREE.MeshStandardMaterial({
      color: 0x22130c,
      bumpMap: this.textures.crumb,
      bumpScale: 0.025,
      roughness: 0.88
    });

    const ganacheMat = new THREE.MeshPhysicalMaterial({
      color: 0x110804,
      roughness: 0.06,
      clearcoat: 0.98,
      clearcoatRoughness: 0.05
    });

    // Tier 1 Base: 4 chocolate blocks
    for (let r = -1; r <= 1; r += 2) {
      for (let c = -1; c <= 1; c += 2) {
        const blockGeo = new THREE.BoxGeometry(0.52, 0.22, 0.52);
        const block = new THREE.Mesh(blockGeo, brownieMat);
        block.position.set(r * 0.28, 0.11, c * 0.28);
        block.rotation.y = (Math.random() - 0.5) * 0.15;
        block.castShadow = true;
        this.cakeGroup.add(block);
      }
    }

    // Tier 2 Middle Block (rotated 45°)
    const midGeo = new THREE.BoxGeometry(0.55, 0.22, 0.55);
    const midBlock = new THREE.Mesh(midGeo, brownieMat);
    midBlock.position.y = 0.33;
    midBlock.rotation.y = Math.PI / 4;
    midBlock.castShadow = true;
    this.cakeGroup.add(midBlock);

    // Tier 3 Top Crown Block
    const topGeo = new THREE.BoxGeometry(0.38, 0.20, 0.38);
    const topBlock = new THREE.Mesh(topGeo, brownieMat);
    topBlock.position.y = 0.54;
    topBlock.rotation.y = 0.15;
    this.cakeGroup.add(topBlock);

    // Molten Chocolate Ganache Drip Waterfall
    const dripMat = ganacheMat;
    const dripGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.05, 32);
    const drip = new THREE.Mesh(dripGeo, dripMat);
    drip.position.y = 0.65;
    this.cakeGroup.add(drip);

    // Roasted Hazelnut Topping Sprinkles
    const nutMat = new THREE.MeshStandardMaterial({ color: 0xbe8848, roughness: 0.6 });
    for (let k = 0; k < 18; k++) {
      const nut = new THREE.Mesh(new THREE.DodecahedronGeometry(0.025), nutMat);
      const angle = (k / 18) * Math.PI * 2;
      const radius = Math.random() * 0.22 + 0.04;
      nut.position.set(Math.cos(angle) * radius, 0.67, Math.sin(angle) * radius);
      this.cakeGroup.add(nut);
    }
  }

  createCheeseTartMesh() {
    // 1. French Sablé Crust Basket with fluted rim
    const shellMat = new THREE.MeshStandardMaterial({
      color: 0xc48c48,
      bumpMap: this.textures.crumb,
      bumpScale: 0.015,
      roughness: 0.78
    });
    const shellGeo = new THREE.CylinderGeometry(0.85, 0.62, 0.36, 64);
    const shell = new THREE.Mesh(shellGeo, shellMat);
    shell.position.y = 0.18;
    shell.castShadow = true;
    this.cakeGroup.add(shell);

    // Fluted Crust Rim
    const rimGeo = new THREE.TorusGeometry(0.85, 0.05, 16, 64);
    const rim = new THREE.Mesh(rimGeo, shellMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.36;
    this.cakeGroup.add(rim);

    // 2. Hokkaido Baked Cheese Custard Dome with Brulee Scorch Map
    const cheeseMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff6dd,
      map: this.textures.brulee,
      roughness: 0.26,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      sheen: 0.25
    });
    const fillingGeo = new THREE.SphereGeometry(0.80, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.44);
    const filling = new THREE.Mesh(fillingGeo, cheeseMat);
    filling.position.y = 0.32;
    filling.castShadow = true;
    this.cakeGroup.add(filling);

    // 3. Molten Lava Core (oozing golden drip)
    const lavaMat = new THREE.MeshPhysicalMaterial({
      color: 0xffe28a,
      roughness: 0.08,
      clearcoat: 0.95
    });
    const lavaDrop = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), lavaMat);
    lavaDrop.position.set(0.42, 0.30, 0.42);
    lavaDrop.scale.set(1.2, 0.8, 1.2);
    this.cakeGroup.add(lavaDrop);
  }

  setupControlsUI() {
    const ui = document.createElement('div');
    ui.className = 'hero-3d-ui-overlay';
    ui.innerHTML = `
      <div class="hero-3d-info-card" id="hero-3d-info-card">
        <div class="hero-3d-badge-row">
          <span class="badge badge-gold" id="hero-3d-badge">Signature Best-Seller</span>
          <span class="hero-3d-status-pill"><span class="pulse-dot"></span> 360° LIVE 3D</span>
        </div>
        <h3 class="hero-3d-name" id="hero-3d-name">Pure Butter Cake</h3>
        <p class="hero-3d-desc" id="hero-3d-desc">100% pure European dairy butter sponge with poured salted caramel glaze, fresh strawberry crown, and 24k edible gold leaf.</p>
        <div class="hero-3d-price-row">
          <span class="hero-3d-price" id="hero-3d-price">RM79</span>
          <a href="#" id="hero-3d-wa-btn" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">
            <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp
          </a>
        </div>
      </div>

      <!-- Realistic Interactive Viewport Toolbar -->
      <div class="hero-3d-toolbar" role="toolbar" aria-label="3D Turntable Tools">
        <button class="turntable-tool-btn" id="btn-turntable-spin" title="Toggle Auto Rotation">
          <i class="fa-solid fa-pause" id="icon-spin"></i>
          <span>Auto-Spin</span>
        </button>
        <button class="turntable-tool-btn" id="btn-turntable-slice" title="Inspect Layers & Slices">
          <i class="fa-solid fa-cake-candles"></i>
          <span>Inspect Slice</span>
        </button>
        <button class="turntable-tool-btn" id="btn-turntable-zoom-in" title="Zoom In">
          <i class="fa-solid fa-magnifying-glass-plus"></i>
        </button>
        <button class="turntable-tool-btn" id="btn-turntable-zoom-out" title="Zoom Out">
          <i class="fa-solid fa-magnifying-glass-minus"></i>
        </button>
      </div>

      <!-- Signature 5-Cake Interactive Model Dock -->
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
          <span class="dock-label">Brownie</span>
        </button>
        <button class="cake-dock-btn" data-cake="cheesetart" title="Cheese Tarts">
          <span class="dock-icon">🧀</span>
          <span class="dock-label">Tart</span>
        </button>
      </div>

      <div class="hero-3d-hint">
        <i class="fa-solid fa-arrows-rotate"></i>
        <span>Touch or drag 360° to rotate</span>
      </div>

      <!-- Dedicated Mobile Order Bar -->
      <div class="hero-3d-mobile-order-bar">
        <a href="#" id="hero-3d-mobile-wa-btn" class="btn btn-primary btn-sm btn-order-turntable-mobile" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp"></i>
          <span>Order <strong id="hero-3d-mobile-cake-name">Pure Butter Cake</strong> (<span id="hero-3d-mobile-price">RM79</span>)</span>
        </a>
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

    // Bind Toolbar Buttons
    const spinBtn = ui.querySelector('#btn-turntable-spin');
    const spinIcon = ui.querySelector('#icon-spin');
    if (spinBtn) {
      spinBtn.addEventListener('click', () => {
        this.autoRotate = !this.autoRotate;
        spinBtn.classList.toggle('active', this.autoRotate);
        if (spinIcon) {
          spinIcon.className = this.autoRotate ? 'fa-solid fa-pause' : 'fa-solid fa-play';
        }
      });
    }

    const sliceBtn = ui.querySelector('#btn-turntable-slice');
    if (sliceBtn) {
      sliceBtn.addEventListener('click', () => {
        this.isSliced = !this.isSliced;
        sliceBtn.classList.toggle('active', this.isSliced);
        this.buildCake();
      });
    }

    const zoomInBtn = ui.querySelector('#btn-turntable-zoom-in');
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        this.zoomLevel = Math.max(0.65, this.zoomLevel - 0.15);
        this.camera.position.z = this.baseCameraPos.z * this.zoomLevel;
      });
    }

    const zoomOutBtn = ui.querySelector('#btn-turntable-zoom-out');
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        this.zoomLevel = Math.min(1.4, this.zoomLevel + 0.15);
        this.camera.position.z = this.baseCameraPos.z * this.zoomLevel;
      });
    }

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
    const mobileWaBtn = this.uiOverlay.querySelector('#hero-3d-mobile-wa-btn');
    const mobileNameEl = this.uiOverlay.querySelector('#hero-3d-mobile-cake-name');
    const mobilePriceEl = this.uiOverlay.querySelector('#hero-3d-mobile-price');

    if (mobileWaBtn) {
      mobileWaBtn.href = `https://wa.me/60123360470?text=${encodeURIComponent(data.waText)}`;
    }
    if (mobileNameEl) mobileNameEl.textContent = data.name;
    if (mobilePriceEl) mobilePriceEl.textContent = data.price;
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
      this.cakeGroup.rotation.y += deltaX * 0.012;
      this.pedestalGroup.rotation.y += deltaX * 0.012;

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      this.isDragging = false;
    };

    canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onPointerUp);

    // Smart Mobile Touch Disambiguation:
    // If user swipes vertically (up/down), page scrolls 100% natively without friction.
    // If user swipes horizontally (left/right), 3D cake turntable rotates effortlessly!
    let touchStartX = 0;
    let touchStartY = 0;
    let touchAxis = null; // 'x' | 'y' | null

    canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchAxis = null;
        this.isDragging = false;
        this.previousMousePosition = { x: touchStartX, y: touchStartY };
      }
    }, { passive: true });

    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length !== 1) return;
      const curX = e.touches[0].clientX;
      const curY = e.touches[0].clientY;

      if (!touchAxis) {
        const dx = Math.abs(curX - touchStartX);
        const dy = Math.abs(curY - touchStartY);
        if (dx < 6 && dy < 6) return;
        if (dy >= dx) {
          touchAxis = 'y'; // Vertical scroll gesture
          this.isDragging = false;
          return;
        } else {
          touchAxis = 'x'; // Horizontal 3D rotate gesture
          this.isDragging = true;
          this.previousMousePosition = { x: curX, y: curY };
        }
      }

      if (touchAxis === 'x' && this.isDragging && this.cakeGroup) {
        const deltaX = curX - this.previousMousePosition.x;
        this.cakeGroup.rotation.y += deltaX * 0.012;
        this.pedestalGroup.rotation.y += deltaX * 0.012;
        this.previousMousePosition = { x: curX, y: curY };
      }
    }, { passive: true });

    const onTouchEnd = () => {
      this.isDragging = false;
      touchAxis = null;
    };
    canvas.addEventListener('touchend', onTouchEnd, { passive: true });
    canvas.addEventListener('touchcancel', onTouchEnd, { passive: true });

    window.addEventListener('resize', () => {
      if (!this.container || !this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w === 0 || h === 0) return;
      const isMobile = window.innerWidth <= 768;
      this.camera.fov = isMobile ? 36 : 32;
      this.camera.aspect = w / h;
      this.baseCameraPos = isMobile
        ? new THREE.Vector3(0, 2.15, 4.15)
        : new THREE.Vector3(0, 1.82, 3.35);
      this.camera.position.copy(this.baseCameraPos);
      this.camera.lookAt(0, isMobile ? 0.45 : 0.32, 0);
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  setupVisibilityObserver() {
    // Zero-CPU optimization: pause Three.js render loop when out of viewport or hidden
    try {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.05 });
      observer.observe(this.container);

      document.addEventListener('visibilitychange', () => {
        this.isVisible = !document.hidden && this.container.offsetParent !== null;
      });
    } catch (e) {
      this.isVisible = true;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Skip all WebGL calculations when not in viewport or stage is hidden
    if (!this.isVisible || document.hidden || this.container.offsetParent === null) {
      return;
    }

    const delta = this.clock.getDelta();

    // Auto rotate turntable if enabled
    if (this.autoRotate && !this.isDragging) {
      if (this.cakeGroup) this.cakeGroup.rotation.y += delta * 0.45;
      if (this.pedestalGroup) this.pedestalGroup.rotation.y += delta * 0.45;
    }

    // Gentle floating motion of gold dust particles
    if (this.sparkles) {
      this.sparkles.rotation.y += delta * 0.15;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
