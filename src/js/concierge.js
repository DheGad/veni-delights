/**
 * VENI DELIGHTS — CONCIERGE / VENI GUIDE
 * Rules-based product discovery engine.
 * No LLM API — deterministic recommendations from verified product catalogue.
 */

import { PRODUCTS, DESSERT_CORNER, BUSINESS } from '../data/products.js';
import { buildProductOrderURL, buildDessertCornerURL, openWhatsApp } from './whatsapp.js';

/** ─────────────────────────────────────────────────
 *  CONVERSATION FLOW DEFINITION
 *  ─────────────────────────────────────────────────
 *  Each step has:
 *  - id: unique identifier
 *  - message: what Veni Host says
 *  - choices: array of { label, value, next } objects
 *  - optional: skip button text
 */

const FLOW = {
  start: {
    id: 'start',
    message: "Hello! Welcome to Veni Delights! 👋 Are you looking for something special for a celebration, or a delicious homemade treat?",
    choices: [
      { label: "🎉 For a Celebration", value: 'celebration', next: 'occasion' },
      { label: "🍰 Just a Treat", value: 'treat', next: 'product_pref' },
      { label: "🎪 Dessert Corner Setup", value: 'event', next: 'event_type' },
    ],
  },

  occasion: {
    id: 'occasion',
    message: "Wonderful! What's the occasion? 🎊",
    choices: [
      { label: "🎂 Birthday", value: 'birthday', next: 'guest_count' },
      { label: "💍 Wedding / Engagement", value: 'wedding', next: 'guest_count' },
      { label: "👔 Corporate Event", value: 'corporate', next: 'guest_count' },
      { label: "👨‍👩‍👧 Family Gathering", value: 'family', next: 'guest_count' },
      { label: "🌸 Festive Celebration", value: 'festive', next: 'guest_count' },
    ],
    optional: 'Skip this question',
  },

  guest_count: {
    id: 'guest_count',
    message: "How many guests are you expecting? This helps me suggest the right quantities! 👥",
    choices: [
      { label: "Just myself / 2–3 people", value: 'personal', next: 'product_pref' },
      { label: "Small group (5–15 people)", value: 'small', next: 'product_pref' },
      { label: "Medium gathering (20–50 people)", value: 'medium', next: 'budget' },
      { label: "Large event (50+ people)", value: 'large', next: 'dessert_corner_suggest' },
    ],
  },

  dessert_corner_suggest: {
    id: 'dessert_corner_suggest',
    message: "For 50+ guests, our Dessert Corner packages are perfect! They include a full table setup and a beautiful selection of desserts. 🎪 Would you like to explore our packages?",
    choices: [
      { label: "Yes, tell me about packages!", value: 'yes_dc', next: 'event_type' },
      { label: "I'd prefer à la carte", value: 'no_dc', next: 'product_pref' },
    ],
  },

  event_type: {
    id: 'event_type',
    message: "What type of event is it? 🎉",
    choices: [
      { label: "🎂 Birthday Party", value: 'birthday', next: 'dc_package' },
      { label: "💍 Wedding / Engagement", value: 'wedding', next: 'dc_package' },
      { label: "👔 Corporate Event", value: 'corporate', next: 'dc_package' },
      { label: "👶 Baby Shower", value: 'baby_shower', next: 'dc_package' },
      { label: "🌟 Anniversary", value: 'anniversary', next: 'dc_package' },
    ],
    optional: 'Skip',
  },

  dc_package: {
    id: 'dc_package',
    message: "Here are our Dessert Corner packages. Which fits your budget? 💎",
    choices: [
      { label: "Budget Package — RM200", value: 'budget-package', next: 'addons' },
      { label: "Package A — RM350", value: 'package-a', next: 'addons' },
      { label: "Package B — RM550 ⭐ Popular", value: 'package-b', next: 'addons' },
      { label: "Package C — RM750 👑 Premium", value: 'package-c', next: 'addons' },
    ],
    optional: 'Not sure, help me choose',
  },

  addons: {
    id: 'addons',
    message: "Great choice! 🎊 Would you like any add-ons to make it extra special?",
    choices: [
      { label: "🍫 Brownies Tower (+RM100)", value: 'brownies-tower', next: 'summary_dc' },
      { label: "🍮 Doll Jelly (+RM30)", value: 'doll-jelly', next: 'summary_dc' },
      { label: "🧁 Cupcakes 20pcs (+RM45)", value: 'cupcakes', next: 'summary_dc' },
      { label: "🍰 Pandan Layer Cake (+RM80)", value: 'pandan-addon', next: 'summary_dc' },
      { label: "✨ No add-ons needed", value: 'none', next: 'summary_dc' },
    ],
  },

  summary_dc: {
    id: 'summary_dc',
    message: "Perfect! Here's what I'll prepare for your enquiry. Ready to send to Veni Delights? 📱",
    choices: [
      { label: "📱 Send WhatsApp Enquiry", value: 'send_dc', next: null, action: 'send_dc' },
      { label: "🔄 Change selections", value: 'restart', next: 'start' },
    ],
  },

  product_pref: {
    id: 'product_pref',
    message: "What type of dessert are you in the mood for? 🍰",
    choices: [
      { label: "🎂 Rich Butter Cakes", value: 'butter', next: 'budget' },
      { label: "🍫 Fudgy Brownies", value: 'brownies', next: 'budget' },
      { label: "🍓 Pavlova Pudding Cake", value: 'pavlova', next: 'flavour_pavlova' },
      { label: "🥧 Fresh Tarts", value: 'tarts', next: 'tart_type' },
      { label: "🌿 Traditional Kuih / Indian Sweets", value: 'traditional', next: 'summary_trad' },
    ],
  },

  flavour_pavlova: {
    id: 'flavour_pavlova',
    message: "Our Pavlova Pudding Cakes are RM88 each. Which flavour appeals to you? 🍓",
    choices: [
      { label: "🍊 Orange", value: 'orange', next: 'summary_product' },
      { label: "🍓 Strawberry", value: 'strawberry', next: 'summary_product' },
      { label: "🍇 Mix Fruit", value: 'mix-fruit', next: 'summary_product' },
      { label: "🌺 Laici", value: 'laici', next: 'summary_product' },
      { label: "🍪 Oreo", value: 'oreo', next: 'summary_product' },
    ],
  },

  tart_type: {
    id: 'tart_type',
    message: "Which type of tart would you like? All tarts have a minimum order of 10 pieces. 🥧",
    choices: [
      { label: "🧀 Cheese Tart (from RM2.50/pc)", value: 'cheese-tart', next: 'summary_product' },
      { label: "🍓 Fruit Tart (from RM2.80/pc)", value: 'fruit-tart', next: 'summary_product' },
      { label: "🥚 Egg Tart (from RM2.50/pc)", value: 'egg-tart', next: 'summary_product' },
    ],
  },

  budget: {
    id: 'budget',
    message: "What's your approximate budget? (Optional — helps me give better suggestions) 💰",
    choices: [
      { label: "Under RM100", value: 'under_100', next: 'summary_product' },
      { label: "RM100 – RM300", value: '100_300', next: 'summary_product' },
      { label: "RM300 – RM600", value: '300_600', next: 'summary_product' },
      { label: "Any budget is fine", value: 'any', next: 'summary_product' },
    ],
    optional: 'Skip',
  },

  summary_trad: {
    id: 'summary_trad',
    message: "Our traditional Kuih Muih and Indian Desserts are made fresh with authentic recipes. Pricing is contact-based. Ready to enquire? 🌿",
    choices: [
      { label: "📱 Enquire via WhatsApp", value: 'enquire_trad', next: null, action: 'enquire_trad' },
      { label: "🔄 Explore other desserts", value: 'restart_products', next: 'product_pref' },
    ],
  },

  summary_product: {
    id: 'summary_product',
    message: "Based on your choices, here are my recommendations! Ready to order?",
    isRecommendation: true,
    choices: [
      { label: "📱 Order via WhatsApp", value: 'order_wa', next: null, action: 'order_wa' },
      { label: "🔄 Explore more options", value: 'more', next: 'product_pref' },
      { label: "🎪 Actually, tell me about Dessert Corner", value: 'dc', next: 'event_type' },
    ],
  },
};

/**
 * Recommendation engine — deterministic rules
 * Maps user selections to specific products
 */
function getRecommendations(state) {
  const { productPref, flavour, occasion, guestCount } = state;
  const recs = [];

  if (productPref === 'butter') {
    // Recommend based on occasion
    if (occasion === 'birthday') {
      recs.push(
        PRODUCTS.find(p => p.id === 'butter-series')?.items.find(i => i.id === 'red-velvet-butter-cake'),
        PRODUCTS.find(p => p.id === 'butter-series')?.items.find(i => i.id === 'pure-butter-cake'),
      );
    } else {
      recs.push(
        PRODUCTS.find(p => p.id === 'butter-series')?.items.find(i => i.id === 'pure-butter-cake'),
        PRODUCTS.find(p => p.id === 'butter-series')?.items.find(i => i.id === 'pandan-butter-cake'),
      );
    }
  }

  if (productPref === 'brownies') {
    recs.push(
      PRODUCTS.find(p => p.id === 'brownies')?.items.find(i => i.id === 'brownies-standard'),
      PRODUCTS.find(p => p.id === 'brownies')?.items.find(i => i.id === 'brownies-celebration'),
    );
  }

  if (productPref === 'pavlova') {
    const pavlovaItems = PRODUCTS.find(p => p.id === 'pavlova')?.items;
    if (flavour && pavlovaItems) {
      const matched = pavlovaItems.find(i => i.variant?.toLowerCase().replace(' ', '-') === flavour);
      if (matched) recs.push(matched);
    }
    if (!recs.length && pavlovaItems) {
      recs.push(pavlovaItems[1], pavlovaItems[0]); // strawberry, orange defaults
    }
  }

  if (productPref === 'tarts') {
    if (flavour === 'cheese-tart') {
      recs.push(
        PRODUCTS.find(p => p.id === 'cheese-tart')?.items.find(i => i.id === 'cheese-tart-strawberry'),
        PRODUCTS.find(p => p.id === 'cheese-tart')?.items.find(i => i.id === 'cheese-tart-blueberry'),
      );
    } else if (flavour === 'fruit-tart') {
      recs.push(PRODUCTS.find(p => p.id === 'fruit-tart')?.items.find(i => i.isMain));
    } else if (flavour === 'egg-tart') {
      recs.push(PRODUCTS.find(p => p.id === 'egg-tart')?.items.find(i => i.isMain));
    }
  }

  return recs.filter(Boolean).slice(0, 3);
}

/** ─────────────────────────────────────────────────
 *  CONCIERGE CLASS
 *  ─────────────────────────────────────────────────
 */
export class VeniConcierge {
  constructor() {
    this.messagesEl = document.getElementById('concierge-messages');
    this.choicesEl = document.getElementById('concierge-choices');
    this.stepLabelEl = document.getElementById('concierge-step-label');
    this.restartBtn = document.getElementById('concierge-restart');

    if (!this.messagesEl) return;

    this.state = this.defaultState();
    this.stepHistory = [];
    this.stepNumber = 1;
    this.totalSteps = 7;

    this.restartBtn?.addEventListener('click', () => this.restart());
    this.init();
  }

  defaultState() {
    return {
      journeyType: null,  // 'celebration' | 'treat' | 'event'
      occasion: null,
      guestCount: null,
      productPref: null,
      flavour: null,
      budget: null,
      selectedPackage: null,
      selectedAddOns: [],
      eventType: null,
    };
  }

  init() {
    this.goToStep('start');
  }

  restart() {
    this.state = this.defaultState();
    this.stepHistory = [];
    this.stepNumber = 1;
    this.messagesEl.innerHTML = '';
    this.choicesEl.innerHTML = '';
    this.goToStep('start');
  }

  goToStep(stepId) {
    const step = FLOW[stepId];
    if (!step) return;

    this.stepHistory.push(stepId);
    this.addBotMessage(step.message);

    // Handle recommendation step
    if (step.isRecommendation) {
      this.showRecommendations();
    }

    this.updateChoices(step);
    this.updateStepLabel();
  }

  addBotMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'concierge-bubble';
    wrap.innerHTML = `
      <div class="concierge-bubble-avatar" aria-hidden="true"><img src="/images/avatars/host-photoreal.jpg" class="concierge-bubble-avatar-img" alt="Chef Veni" /></div>
      <div class="concierge-bubble-text">${text}</div>
    `;
    this.messagesEl.appendChild(wrap);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  addUserMessage(text) {
    const wrap = document.createElement('div');
    wrap.className = 'concierge-bubble concierge-bubble-user';
    wrap.innerHTML = `
      <div class="concierge-bubble-avatar" aria-hidden="true">👤</div>
      <div class="concierge-bubble-text">${text}</div>
    `;
    this.messagesEl.appendChild(wrap);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  updateChoices(step) {
    this.choicesEl.innerHTML = '';

    const choices = step.choices || [];

    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'concierge-choice-btn';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => this.handleChoice(choice, step));
      this.choicesEl.appendChild(btn);
    });

    // Skip button
    if (step.optional) {
      const skipBtn = document.createElement('button');
      skipBtn.className = 'concierge-choice-btn';
      skipBtn.style.opacity = '0.6';
      skipBtn.textContent = step.optional;
      skipBtn.addEventListener('click', () => {
        this.addUserMessage('Skip this question');
        const nextStep = step.choices[0]?.next || 'product_pref';
        this.updateChoices({ choices: [] });
        setTimeout(() => this.goToStep(nextStep), 400);
      });
      this.choicesEl.appendChild(skipBtn);
    }
  }

  handleChoice(choice, step) {
    // Record answer in state
    this.recordAnswer(step.id, choice.value);
    this.addUserMessage(choice.label);

    // Clear choices
    this.updateChoices({ choices: [] });

    // Handle actions
    if (choice.action) {
      setTimeout(() => this.executeAction(choice.action), 600);
      return;
    }

    // Navigate to next step
    if (choice.next) {
      setTimeout(() => this.goToStep(choice.next), 600);
    }
  }

  recordAnswer(stepId, value) {
    switch (stepId) {
      case 'start':        this.state.journeyType = value; break;
      case 'occasion':     this.state.occasion = value; break;
      case 'guest_count':  this.state.guestCount = value; break;
      case 'event_type':   this.state.eventType = value; break;
      case 'dc_package':   this.state.selectedPackage = value; break;
      case 'addons':       if (value !== 'none') this.state.selectedAddOns.push(value); break;
      case 'product_pref': this.state.productPref = value; break;
      case 'flavour_pavlova': this.state.flavour = value; break;
      case 'tart_type':    this.state.flavour = value; break;
      case 'budget':       this.state.budget = value; break;
    }
    this.stepNumber++;
  }

  executeAction(action) {
    switch (action) {
      case 'send_dc':
        this.sendDessertCornerEnquiry();
        break;
      case 'order_wa':
        this.sendProductOrder();
        break;
      case 'enquire_trad':
        this.enquireTraditional();
        break;
    }
  }

  sendDessertCornerEnquiry() {
    const pkg = DESSERT_CORNER.packages.find(p => p.id === this.state.selectedPackage);
    const addOns = this.state.selectedAddOns
      .map(id => DESSERT_CORNER.addOns.find(a => a.id === id))
      .filter(Boolean);

    const url = buildDessertCornerURL({
      selectedPackage: pkg || null,
      addOns,
      eventType: this.state.eventType || '',
    });

    this.addBotMessage("Opening WhatsApp with your Dessert Corner enquiry... 📱 Please send the message to confirm your enquiry!");

    setTimeout(() => openWhatsApp(url), 800);

    // Show restart
    this.updateChoices({
      choices: [{ label: "🔄 Start a new enquiry", value: 'restart', next: 'start' }],
    });
    // Bind the restart action
    this.choicesEl.querySelector('button')?.addEventListener('click', () => this.restart());
  }

  sendProductOrder() {
    const recs = getRecommendations(this.state);
    if (recs.length === 0) {
      const url = `https://wa.me/${BUSINESS.whatsapp}?text=Hello%20Veni%20Delights!%20I%27d%20like%20to%20browse%20your%20desserts.`;
      openWhatsApp(url);
      return;
    }

    const orderItems = recs.map(r => ({
      name: r.name,
      variant: r.variant || null,
      quantity: 1,
    }));

    const url = buildProductOrderURL({ items: orderItems });
    this.addBotMessage("Opening WhatsApp with your recommendations... 📱");
    setTimeout(() => openWhatsApp(url), 800);
  }

  enquireTraditional() {
    const url = `https://wa.me/${BUSINESS.whatsapp}?text=Hello%20Veni%20Delights!%20I%27d%20like%20to%20enquire%20about%20Traditional%20Kuih%20Muih%20and%20Indian%20Desserts.%20Please%20advise%20on%20availability%20and%20pricing.`;
    openWhatsApp(url);
  }

  showRecommendations() {
    const recs = getRecommendations(this.state);
    if (!recs.length) return;

    const recDiv = document.createElement('div');
    recDiv.className = 'concierge-bubble';
    recDiv.innerHTML = `
      <div class="concierge-bubble-avatar" aria-hidden="true"><img src="/images/avatars/host-photoreal.jpg" class="concierge-bubble-avatar-img" alt="Chef Veni" /></div>
      <div class="concierge-bubble-text">
        <strong>My top picks for you:</strong>
        <ul style="margin-top:8px; padding-left:16px; font-size:0.85em;">
          ${recs.map(r => `<li style="margin-bottom:4px;">
            <strong>${r.name}</strong>${r.variant ? ` — ${r.variant}` : ''} 
            ${r.priceDisplay ? `<span style="color:var(--color-gold-antique)">${r.priceDisplay}</span>` : ''}
          </li>`).join('')}
        </ul>
      </div>
    `;
    this.messagesEl.appendChild(recDiv);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  updateStepLabel() {
    if (this.stepLabelEl) {
      this.stepLabelEl.textContent = `Step ${Math.min(this.stepNumber, this.totalSteps)} of ${this.totalSteps}`;
    }
  }
}
