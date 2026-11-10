/**
 * VENI DELIGHTS — 3D BAKERY WORLD & PATISSERIE ENVIRONMENT
 * Immersive Three.js 3D Patisserie with:
 * - French Patisserie architectural interior (chevron parquet, marble counters, brass chandeliers)
 * - Glass dessert showcase cabinets with illuminated tiers & handcrafted pastries
 * - Professional bakery workstation with copper bowls, fresh strawberry baskets, oven glow
 * - Signature rotating 3D cake turntable
 * - Cinematic camera waypoints: Entrance, Workstation, Showcase, Turntable, Celebration
 * - GSAP smooth camera flight transitions & 360° orbit interaction
 */

import * as THREE from 'three';
import { gsap } from 'gsap';
import { CAKE_MODELS_DATA } from './showcase3d.js';

export class BakeryWorld3D {
  constructor(containerId = 'bakery-world-stage') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentWaypoint = 'entrance';
    this.clock = new THREE.Clock();
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.activeCake = 'butter';

    // Camera Waypoint coordinates (Position & Target)
    this.waypoints = {
      entrance: {
        pos: new THREE.Vector3(0, 2.6, 6.2),
        target: new THREE.Vector3(0, 1.2, 0),
        fov: 42,
        title: 'Bakery Entrance',
        desc: 'Welcome to Veni Delights. Take in the warm Parisian patisserie atmosphere.'
      },
      workstation: {
        pos: new THREE.Vector3(-2.8, 1.8, 1.8),
        target: new THREE.Vector3(-2.2, 1.1, -1.2),
        fov: 38,
        title: 'Chef Station & Workstation',
        desc: 'Where our Master Baker creams French butter, extracts fresh pandan, and folds dark cocoa.'
      },
      showcase: {
        pos: new THREE.Vector3(2.6, 1.9, 2.0),
        target: new THREE.Vector3(2.2, 1.3, -0.8),
        fov: 38,
        title: 'Glass Dessert Cabinet',
        desc: 'Illuminated showcase displaying fresh tarts, pavlovas, and signature pastries.'
      },
      turntable: {
        pos: new THREE.Vector3(0, 1.85, 3.2),
        target: new THREE.Vector3(0, 0.45, 0),
        fov: 34,
        title: 'Signature 3D Cake Turntable',
        desc: 'Rotate, inspect, and explore all 5 signature creations with 360° precision.'
      },
      celebration: {
        pos: new THREE.Vector3(1.6, 2.4, 4.6),
        target: new THREE.Vector3(0.5, 0.9, -1.5),
        fov: 45,
        title: 'Dessert Corner Suite',
        desc: 'Event celebration setup for birthdays, weddings, and corporate galas.'
      }
    };

    this.isVisible = true;
    this.init();
  }

  init() {
    this.setupScene();
    this.setupLights();
    this.buildArchitecture();
    this.buildGlassCabinet();
    this.buildWorkstation();
    this.buildCenterTurntable();
    this.setupControlsUI();
    this.bindEvents();
    this.setupVisibilityObserver();
    this.animate();
  }

  setupScene() {
    const w = this.container.clientWidth || 960;
    const h = this.container.clientHeight || 560;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0c0808);
    this.scene.fog = new THREE.FogExp2(0x0c0808, 0.045);

    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
    const startWp = this.waypoints.entrance;
    this.camera.position.copy(startWp.pos);
    this.cameraTarget = startWp.target.clone();
    this.camera.lookAt(this.cameraTarget);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);
  }

  setupLights() {
    // Ambient light - warm champagne
    const ambient = new THREE.AmbientLight(0xfff3e6, 0.75);
    this.scene.add(ambient);

    // Main Chandelier overhead
    const chandelier = new THREE.PointLight(0xffe2b8, 3.2, 16, 1.2);
    chandelier.position.set(0, 4.5, 0);
    chandelier.castShadow = true;
    this.scene.add(chandelier);

    // Warm Cabinet Spotlight
    const cabinetSpot = new THREE.SpotLight(0xffeedd, 2.8, 10, Math.PI / 4, 0.35);
    cabinetSpot.position.set(2.5, 3.8, 1);
    cabinetSpot.target.position.set(2.2, 1.2, -0.8);
    this.scene.add(cabinetSpot);
    this.scene.add(cabinetSpot.target);

    // Workstation Warm Glow
    const ovenGlow = new THREE.PointLight(0xff8833, 2.5, 6, 1.5);
    ovenGlow.position.set(-3.2, 1.2, -2.5);
    this.scene.add(ovenGlow);

    // Center Turntable Key Spotlight
    this.turntableSpot = new THREE.SpotLight(0xfff6ea, 3.8, 10, Math.PI / 4.5, 0.3);
    this.turntableSpot.position.set(0, 3.8, 1.8);
    this.turntableSpot.target.position.set(0, 0.45, 0);
    this.turntableSpot.castShadow = true;
    this.scene.add(this.turntableSpot);
    this.scene.add(this.turntableSpot.target);
  }

  buildArchitecture() {
    // 1. Chevron Parquetry Floor
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x22130e,
      roughness: 0.35,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Back Wall with Paneling & Moulding
    const backWallGeo = new THREE.PlaneGeometry(16, 6);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x180f0e,
      roughness: 0.8
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 3, -4);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    // Gold Trim Horizontal Baseboard & Crown
    const trimMat = new THREE.MeshStandardMaterial({ color: 0xd5ae61, metalness: 0.8, roughness: 0.25 });
    const baseboard = new THREE.Mesh(new THREE.BoxGeometry(16, 0.18, 0.08), trimMat);
    baseboard.position.set(0, 0.09, -3.95);
    this.scene.add(baseboard);

    const chairRail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.08, 0.06), trimMat);
    chairRail.position.set(0, 1.8, -3.95);
    this.scene.add(chairRail);

    // 3. Side Walls
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6, 3, 0);
    this.scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(12, 6), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(6, 3, 0);
    this.scene.add(rightWall);

    // 4. Parisian Arch Window on Left Wall
    const windowFrame = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.08, 16, 32, Math.PI), trimMat);
    windowFrame.rotation.y = Math.PI / 2;
    windowFrame.position.set(-5.95, 3.6, 0);
    this.scene.add(windowFrame);
  }

  buildGlassCabinet() {
    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.set(2.8, 0, -1.2);

    // Brass Frame
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xd5ae61, metalness: 0.9, roughness: 0.2 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5
    });

    // Cabinet Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.6, 1.2), brassMat);
    base.position.y = 0.3;
    base.castShadow = true;
    cabinetGroup.add(base);

    // Glass Showcase Box
    const glassBox = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.4, 1.1), glassMat);
    glassBox.position.y = 1.3;
    cabinetGroup.add(glassBox);

    // Glass Shelf Inside
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.03, 0.9), glassMat);
    shelf.position.y = 1.2;
    cabinetGroup.add(shelf);

    // Miniature Pastries Inside Cabinet
    const tartMat = new THREE.MeshStandardMaterial({ color: 0xc89452, roughness: 0.7 });
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xa92d42, roughness: 0.2 });

    for (let i = -3; i <= 3; i++) {
      // Tart shell
      const miniTart = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.05, 16), tartMat);
      miniTart.position.set(i * 0.3, 1.25, 0);
      // Strawberry on top
      const miniBerry = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.08, 12), berryMat);
      miniBerry.position.set(i * 0.3, 1.31, 0);
      cabinetGroup.add(miniTart);
      cabinetGroup.add(miniBerry);
    }

    this.scene.add(cabinetGroup);
  }

  buildWorkstation() {
    const stationGroup = new THREE.Group();
    stationGroup.position.set(-2.8, 0, -1.2);

    // Marble Countertop
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.15,
      metalness: 0.05
    });
    const woodBaseMat = new THREE.MeshStandardMaterial({ color: 0x3d201a, roughness: 0.7 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 1.3), woodBaseMat);
    base.position.y = 0.425;
    base.castShadow = true;
    stationGroup.add(base);

    const counter = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 1.4), marbleMat);
    counter.position.y = 0.89;
    counter.castShadow = true;
    stationGroup.add(counter);

    // Artisan Copper Mixing Bowl
    const copperMat = new THREE.MeshStandardMaterial({ color: 0xd97548, metalness: 0.95, roughness: 0.2 });
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.6), copperMat);
    bowl.position.set(-0.6, 0.95, 0);
    stationGroup.add(bowl);

    // Wooden Rolling Pin
    const pinMat = new THREE.MeshStandardMaterial({ color: 0xd1a674, roughness: 0.6 });
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.65, 16), pinMat);
    pin.rotation.z = Math.PI / 3;
    pin.position.set(0.4, 0.96, -0.2);
    stationGroup.add(pin);

    // Ceramic Bowl with Fresh Red Strawberries
    const ceramicMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
    const berryMat = new THREE.MeshStandardMaterial({ color: 0xa92d42, roughness: 0.3 });
    const fruitBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.12, 0.12, 24), ceramicMat);
    fruitBowl.position.set(0.1, 0.99, 0.15);
    stationGroup.add(fruitBowl);

    // Strawberries inside bowl
    for (let s = 0; s < 7; s++) {
      const berry = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.09, 12), berryMat);
      const angle = (s / 7) * Math.PI * 2;
      berry.position.set(0.1 + Math.cos(angle) * 0.08, 1.08, 0.15 + Math.sin(angle) * 0.08);
      stationGroup.add(berry);
    }

    this.scene.add(stationGroup);
  }

  buildCenterTurntable() {
    this.turntableGroup = new THREE.Group();
    this.turntableGroup.position.set(0, 0, 0);

    // Spun Marble Pedestal
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x141010, roughness: 0.2, metalness: 0.2 });
    const goldRingMat = new THREE.MeshStandardMaterial({ color: 0xd5ae61, metalness: 0.9, roughness: 0.2 });

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.1, 0.12, 64), pedestalMat);
    pedestal.position.y = 0.06;
    pedestal.receiveShadow = true;
    this.turntableGroup.add(pedestal);

    const goldRing = new THREE.Mesh(new THREE.TorusGeometry(1.14, 0.025, 16, 64), goldRingMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.y = 0.12;
    this.turntableGroup.add(goldRing);

    // Swappable Active Cake
    this.cakeMeshGroup = new THREE.Group();
    this.cakeMeshGroup.position.y = 0.12;
    this.turntableGroup.add(this.cakeMeshGroup);

    this.scene.add(this.turntableGroup);
    this.buildActiveCakeMesh();
  }

  buildActiveCakeMesh() {
    while (this.cakeMeshGroup.children.length > 0) {
      this.cakeMeshGroup.remove(this.cakeMeshGroup.children[0]);
    }

    // Pure Butter / Signature Strawberry Cake mesh
    const spongeMat = new THREE.MeshStandardMaterial({ color: 0xe6b566, roughness: 0.65 });
    const glazeMat = new THREE.MeshPhysicalMaterial({ color: 0xa92d42, roughness: 0.15, clearcoat: 0.8 });
    const creamMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.2, clearcoat: 0.4 });

    // Tier 1 Sponge
    const tier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.45, 64), spongeMat);
    tier1.position.y = 0.225;
    tier1.castShadow = true;
    this.cakeMeshGroup.add(tier1);

    // Strawberry Coulis Drip
    const coulis = new THREE.Mesh(new THREE.CylinderGeometry(0.77, 0.77, 0.08, 64), glazeMat);
    coulis.position.y = 0.48;
    this.cakeMeshGroup.add(coulis);

    // Whipped Cream Rosettes & Strawberries
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 0.52;
      const z = Math.sin(angle) * 0.52;

      // Cream Rosette
      const rosette = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), creamMat);
      rosette.position.set(x, 0.56, z);
      this.cakeMeshGroup.add(rosette);

      // Fresh Strawberry Crown
      const berry = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 16), glazeMat);
      berry.position.set(x, 0.66, z);
      this.cakeMeshGroup.add(berry);
    }
  }

  setupControlsUI() {
    const hud = document.createElement('div');
    hud.className = 'bakery-world-hud';
    hud.innerHTML = `
      <div class="world-waypoint-nav" role="tablist" aria-label="Explore bakery areas">
        <button class="waypoint-btn active" data-waypoint="entrance"><i class="fa-solid fa-door-open"></i> Entrance</button>
        <button class="waypoint-btn" data-waypoint="workstation"><i class="fa-solid fa-kitchen-set"></i> Chef Station</button>
        <button class="waypoint-btn" data-waypoint="showcase"><i class="fa-solid fa-store"></i> Glass Showcase</button>
        <button class="waypoint-btn" data-waypoint="turntable"><i class="fa-solid fa-arrows-rotate"></i> 3D Turntable</button>
        <button class="waypoint-btn" data-waypoint="celebration"><i class="fa-solid fa-champagne-glasses"></i> Dessert Corner</button>
      </div>

      <div class="world-info-card">
        <span class="world-info-badge" id="world-hud-badge">Veni Delights 3D World</span>
        <h4 class="world-info-title" id="world-hud-title">Bakery Entrance</h4>
        <p class="world-info-desc" id="world-hud-desc">Welcome to Veni Delights. Take in the warm Parisian patisserie atmosphere.</p>
      </div>

      <div class="world-drag-hint">
        <i class="fa-solid fa-hand-pointer"></i> <span>Drag to look around 360°</span>
      </div>
    `;

    this.container.appendChild(hud);
    this.hud = hud;

    // Bind waypoint buttons
    hud.querySelectorAll('.waypoint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        hud.querySelectorAll('.waypoint-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.navigateTo(btn.dataset.waypoint);
      });
    });
  }

  navigateTo(waypointKey) {
    const wp = this.waypoints[waypointKey];
    if (!wp) return;
    this.currentWaypoint = waypointKey;

    // Smooth GSAP Camera Flight
    gsap.to(this.camera.position, {
      x: wp.pos.x,
      y: wp.pos.y,
      z: wp.pos.z,
      duration: 1.8,
      ease: 'power3.inOut'
    });

    gsap.to(this.cameraTarget, {
      x: wp.target.x,
      y: wp.target.y,
      z: wp.target.z,
      duration: 1.8,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.camera.lookAt(this.cameraTarget);
      }
    });

    // Update HUD Info
    if (this.hud) {
      const titleEl = this.hud.querySelector('#world-hud-title');
      const descEl = this.hud.querySelector('#world-hud-desc');
      if (titleEl) titleEl.textContent = wp.title;
      if (descEl) descEl.textContent = wp.desc;
    }
  }

  bindEvents() {
    const canvas = this.renderer.domElement;

    const onPointerDown = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerMove = (clientX, clientY) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      if (this.currentWaypoint === 'turntable' && this.turntableGroup) {
        this.turntableGroup.rotation.y += deltaX * 0.01;
      } else {
        // Subtle orbital camera pan
        this.camera.position.x += deltaX * 0.005;
        this.camera.position.y = Math.max(1.0, Math.min(3.8, this.camera.position.y - deltaY * 0.005));
        this.camera.lookAt(this.cameraTarget);
      }

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

    canvas.addEventListener('touchmove', (e) => {
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

  setupVisibilityObserver() {
    if ('IntersectionObserver' in window && this.container) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.isVisible = entry.isIntersecting && !document.hidden;
        });
      }, { threshold: 0.05 });
      this.observer.observe(this.container);
    }

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Skip render if offscreen or hidden (0% idle GPU/CPU)
    if (!this.isVisible || document.hidden || (this.container && this.container.offsetParent === null)) {
      return;
    }

    const delta = this.clock.getDelta();

    // Auto rotate turntable if in turntable or entrance view
    if (this.turntableGroup && !this.isDragging) {
      this.turntableGroup.rotation.y += delta * 0.35;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
