/**
 * VENI DELIGHTS — AUTOMATED TEST SUITE
 * Verifies catalogue rules, pricing calculations, WhatsApp message encoding,
 * minimum order quantities, and data integrity.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { PRODUCTS, DESSERT_CORNER, BUSINESS, calculateTartPrice } from './src/data/products.js';
import {
  buildProductOrderURL,
  buildDessertCornerURL,
  buildSimpleOrderURL,
  validateOrder
} from './src/js/whatsapp.js';

// ─── TEST SUITE 1: BUSINESS INTEGRITY ──────────────────────────────────────
test('Business information integrity', () => {
  assert.equal(BUSINESS.name, 'Veni Delights');
  assert.equal(BUSINESS.whatsapp, '60123360470');
  assert.equal(BUSINESS.phone, '012-336 0470');
  assert.equal(BUSINESS.email, 'kagsivasiva15@gmail.com');
  assert.equal(BUSINESS.hours, '9:00 AM – 9:00 PM (Daily)');
});

// ─── TEST SUITE 2: BUTTER SERIES PRICING ──────────────────────────────────
test('Butter Series pricing: all items must be RM79', () => {
  const butterSeries = PRODUCTS.find(p => p.id === 'butter-series');
  assert.ok(butterSeries, 'Butter Series category exists');
  assert.equal(butterSeries.categoryPrice, 'RM79');

  butterSeries.items.forEach(item => {
    assert.equal(item.price, 79, `${item.name} must be priced at RM79`);
    assert.equal(item.priceDisplay, 'RM79');
  });
});

// ─── TEST SUITE 3: BROWNIES PRICING ───────────────────────────────────────
test('Brownies category price: RM59 standard', () => {
  const brownies = PRODUCTS.find(p => p.id === 'brownies');
  assert.ok(brownies, 'Brownies category exists');
  assert.equal(brownies.categoryPrice, 'RM59');

  const standard = brownies.items.find(i => i.id === 'brownies-standard');
  assert.equal(standard.price, 59);

  const custom = brownies.items.find(i => i.id === 'brownies-custom');
  assert.equal(custom.isEnquiry, true);
  assert.equal(custom.priceDisplay, 'RM59 + charges');
});

// ─── TEST SUITE 4: PANDAN LAYER CAKE PRICING ──────────────────────────────
test('Pandan Layer Cake: 8 Inch is RM69, 10 Inch is RM89', () => {
  const pandan = PRODUCTS.find(p => p.id === 'pandan-layer');
  assert.ok(pandan);

  const eightInch = pandan.items.find(i => i.id === 'pandan-layer-8inch');
  assert.equal(eightInch.price, 69);

  const tenInch = pandan.items.find(i => i.id === 'pandan-layer-10inch');
  assert.equal(tenInch.price, 89);
});

// ─── TEST SUITE 5: PAVLOVA PUDDING CAKE PRICING ───────────────────────────
test('Pavlova Pudding Cake: all 5 flavours must be RM88', () => {
  const pavlova = PRODUCTS.find(p => p.id === 'pavlova');
  assert.ok(pavlova);
  assert.equal(pavlova.items.length, 5);

  pavlova.items.forEach(item => {
    assert.equal(item.price, 88, `${item.variant} Pavlova must be RM88`);
    assert.equal(item.priceDisplay, 'RM88');
  });
});

// ─── TEST SUITE 6: TARTS TIERED PRICING & MINIMUM ORDERS ──────────────────
test('Cheese Tart minimum order and bulk rate calculations', () => {
  // Below minimum 10
  const belowMin = calculateTartPrice('cheese-tart', 5);
  assert.ok(belowMin.error, 'Quantities below 10 should return error');

  // Exact minimum 10 (RM2.50)
  const tenPcs = calculateTartPrice('cheese-tart', 10);
  assert.equal(tenPcs.pricePerUnit, 2.50);
  assert.equal(tenPcs.total, 25.00);

  // 100 pcs (RM2.50)
  const hundredPcs = calculateTartPrice('cheese-tart', 100);
  assert.equal(hundredPcs.pricePerUnit, 2.50);
  assert.equal(hundredPcs.total, 250.00);

  // 101 pcs bulk tier (RM2.00)
  const bulkPcs = calculateTartPrice('cheese-tart', 101);
  assert.equal(bulkPcs.pricePerUnit, 2.00);
  assert.equal(bulkPcs.total, 202.00);
});

test('Fruit Tart minimum order and bulk rate calculations', () => {
  const belowMin = calculateTartPrice('fruit-tart', 9);
  assert.ok(belowMin.error);

  const thirtyPcs = calculateTartPrice('fruit-tart', 30);
  assert.equal(thirtyPcs.pricePerUnit, 3.00);
  assert.equal(thirtyPcs.total, 90.00);

  const thirtyOnePcs = calculateTartPrice('fruit-tart', 31);
  assert.equal(thirtyOnePcs.pricePerUnit, 2.80);
  assert.equal(thirtyOnePcs.total, 86.80);
});

test('Egg Tart minimum order and bulk rate calculations', () => {
  const belowMin = calculateTartPrice('egg-tart', 8);
  assert.ok(belowMin.error);

  const twentyPcs = calculateTartPrice('egg-tart', 20);
  assert.equal(twentyPcs.pricePerUnit, 2.80);
  assert.equal(twentyPcs.total, 56.00);

  const bulkPcs = calculateTartPrice('egg-tart', 35);
  assert.equal(bulkPcs.pricePerUnit, 2.50);
  assert.equal(bulkPcs.total, 87.50);
});

// ─── TEST SUITE 7: DESSERT CORNER PACKAGES ────────────────────────────────
test('Dessert Corner packages and add-ons verified data', () => {
  assert.equal(DESSERT_CORNER.packages.length, 4);

  const budget = DESSERT_CORNER.packages.find(p => p.id === 'budget-package');
  assert.equal(budget.price, 200);

  const pkgA = DESSERT_CORNER.packages.find(p => p.id === 'package-a');
  assert.equal(pkgA.price, 350);

  const pkgB = DESSERT_CORNER.packages.find(p => p.id === 'package-b');
  assert.equal(pkgB.price, 550);

  const pkgC = DESSERT_CORNER.packages.find(p => p.id === 'package-c');
  assert.equal(pkgC.price, 750);

  // Add-ons
  const browniesTower = DESSERT_CORNER.addOns.find(a => a.id === 'brownies-tower');
  assert.equal(browniesTower.price, 100);

  const dollJelly = DESSERT_CORNER.addOns.find(a => a.id === 'doll-jelly');
  assert.equal(dollJelly.price, 30);

  const cupcakes = DESSERT_CORNER.addOns.find(a => a.id === 'cupcakes-20');
  assert.equal(cupcakes.price, 45);

  const pandanLayer = DESSERT_CORNER.addOns.find(a => a.id === 'pandan-layer');
  assert.equal(pandanLayer.price, 80);

  const pavlova = DESSERT_CORNER.addOns.find(a => a.id === 'pavlova');
  assert.equal(pavlova.price, 88);
});

// ─── TEST SUITE 8: WHATSAPP INTEGRATION & ENCODING ────────────────────────
test('WhatsApp URL builder correctness and security', () => {
  const url = buildProductOrderURL({
    customerName: 'Ahmad Faiz',
    preferredDate: '2026-12-15',
    deliveryPreference: 'Self Pickup',
    specialInstructions: 'Please write "Happy Birthday"',
    items: [
      { name: 'Pure Butter Cake', variant: null, quantity: 1 },
      { name: 'Cheese Tart', variant: 'Strawberry', quantity: 15 }
    ]
  });

  assert.ok(url.startsWith('https://wa.me/60123360470?text='));
  assert.ok(url.includes('Ahmad%20Faiz'));
  assert.ok(url.includes('Pure%20Butter%20Cake'));
  assert.ok(url.includes('Strawberry'));
});

test('WhatsApp Dessert Corner quotation URL builder', () => {
  const pkg = DESSERT_CORNER.packages.find(p => p.id === 'package-b');
  const addOns = [DESSERT_CORNER.addOns[0]]; // Brownies Tower

  const url = buildDessertCornerURL({
    customerName: 'Priya Sharma',
    selectedPackage: pkg,
    addOns: addOns,
    eventType: 'Wedding',
    eventDate: '2026-11-20',
    guestCount: '100 - 200',
    eventLocation: 'Klang'
  });

  assert.ok(url.startsWith('https://wa.me/60123360470?text='));
  assert.ok(url.includes('Package%20B'));
  assert.ok(url.includes('Brownies%20Tower'));
  assert.ok(url.includes('Priya%20Sharma'));
});

test('Order validation checks for empty cart and minimums', () => {
  const emptyRes = validateOrder([]);
  assert.equal(emptyRes.valid, false);

  const validRes = validateOrder([
    { name: 'Pure Butter Cake', quantity: 1 }
  ]);
  assert.equal(validRes.valid, true);

  const minOrderFail = validateOrder([
    { name: 'Cheese Tart', quantity: 5, minimumOrder: 10 }
  ]);
  assert.equal(minOrderFail.valid, false);
});

// ─── TEST SUITE 13: 20-PAGE ARCHITECTURE INTEGRITY ─────────────────────────
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_PAGES = [
  'index.html',
  'about.html',
  'products.html',
  'butter-cakes.html',
  'brownies.html',
  'pandan-layer.html',
  'pavlova.html',
  'fruit-tarts.html',
  'egg-tarts.html',
  'cheese-tarts.html',
  'traditional-indian.html',
  'traditional-kuih.html',
  'dessert-corner.html',
  'customise.html',
  'concierge.html',
  'gallery.html',
  'reviews.html',
  'faq.html',
  'contact.html',
  'order.html'
];

test('Multi-page architecture: all 20 independent HTML pages must exist and have valid structure', () => {
  REQUIRED_PAGES.forEach(page => {
    const filePath = path.join(process.cwd(), page);
    assert.ok(fs.existsSync(filePath), `Page ${page} must exist in project root`);

    const content = fs.readFileSync(filePath, 'utf-8');
    assert.ok(content.includes('<title>'), `${page} must include <title> tag`);
    assert.ok(content.includes('<meta name="description"'), `${page} must include meta description`);
    assert.ok(content.includes('/src/js/main.js'), `${page} must reference master JS bundle`);
    assert.ok(content.includes('60123360470'), `${page} must contain verified WhatsApp contact number`);
    assert.ok(content.includes('order-drawer'), `${page} must include shared order drawer`);
    assert.ok(content.includes('navbar'), `${page} must include main navigation`);
    assert.ok(content.includes('footer'), `${page} must include footer with business info`);
  });
});

test('Brand asset treatments exist', () => {
  const brandAssets = [
    'public/images/logo/logo-strawberry.svg',
    'public/images/logo/logo-cream.svg',
    'public/images/logo/logo-dark.svg',
    'public/images/logo/brandmark-mobile.svg',
    'public/images/logo/favicon.svg',
    'public/images/logo/social-profile.svg'
  ];

  brandAssets.forEach(asset => {
    assert.ok(fs.existsSync(path.join(process.cwd(), asset)), `Brand asset ${asset} must exist`);
  });
});

test('3D Environment & Cinema media modules exist', () => {
  assert.ok(fs.existsSync(path.join(process.cwd(), 'src/js/bakery-world-3d.js')), 'BakeryWorld3D module exists');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'src/js/cinematic-media.js')), 'CinematicMediaPlayer module exists');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'src/js/liquid-parallax.js')), 'LiquidParallaxSystem module exists');
  assert.ok(fs.existsSync(path.join(process.cwd(), 'src/data/media-manifest.js')), 'MEDIA_MANIFEST exists');
});

