/**
 * VENI DELIGHTS — CINEMATIC MEDIA ASSET MANIFEST
 * Complete specification of all commercial video targets,
 * resolutions, durations, poster frames, subtitles, and production status.
 */

export const MEDIA_MANIFEST = [
  {
    id: 'hero-intro',
    title: 'A Little World of Homemade Magic',
    category: 'Brand Introduction',
    description: 'Cinematic journey through the Veni Delights patisserie in Klang, from dawn butter melting to evening celebration cake dispatch.',
    duration: '0:45',
    resolution: '3840x2160 4K UHD',
    aspectRatio: '16:9',
    poster: 'images/hero/hero-1.png',
    status: 'interactive_canvas_live',
    theme: 'strawberry-luxury',
    captions: [
      { start: 0, end: 8, text: 'In Klang, Selangor, every morning begins with pure European butter and fresh pandan.' },
      { start: 8, end: 18, text: 'Veni Delights: where traditional heritage meets contemporary luxury patisserie.' },
      { start: 18, end: 32, text: 'From golden butter cakes to decadent five-layer pandan and cloud pavlovas.' },
      { start: 32, end: 45, text: 'Handcrafted fresh daily for your most cherished life celebrations.' }
    ]
  },
  {
    id: 'veni-host-intro',
    title: 'Meet Your Personal Concierge — Veni Host',
    category: 'Digital Human',
    description: 'Veni Host welcomes guests to the digital bakery, explaining personalized dessert curation, flavour pairing, and celebration setups.',
    duration: '0:35',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/hero/hero-2.png',
    status: 'interactive_canvas_live',
    theme: 'hospitality',
    captions: [
      { start: 0, end: 10, text: 'Welcome to Veni Delights. I am your personal digital concierge.' },
      { start: 10, end: 22, text: 'Whether an intimate family gathering or a 500-guest wedding, let me guide you.' },
      { start: 22, end: 35, text: 'Tap Ask Concierge at any time to explore custom pairings and instant quotations.' }
    ]
  },
  {
    id: 'master-baker-craft',
    title: 'The Artisan Touch — Master Baker Craftsman',
    category: 'Craftsmanship',
    description: 'Behind-the-scenes artisan baking: slow creaming of French butter, hand-folding organic cocoa, and hand-piping silky molten cheese.',
    duration: '0:50',
    resolution: '3840x2160 4K UHD',
    aspectRatio: '16:9',
    poster: 'images/hero/hero-3.png',
    status: 'interactive_canvas_live',
    theme: 'artisan',
    captions: [
      { start: 0, end: 12, text: 'True baking is a slow craft. We never rush the rise or skimp on pure butter.' },
      { start: 12, end: 28, text: 'Every pandan leaf is harvested fresh and extracted naturally with zero artificial essences.' },
      { start: 28, end: 50, text: 'Baked fresh to order each morning in Klang Valley for pure, unforgettable taste.' }
    ]
  },
  {
    id: 'butter-commercial',
    title: 'Butter Series — The Golden Standard',
    category: 'Product Commercial',
    description: 'Macro cinematography of the Pure Butter Cake, Orange Butter Cake, and Marble Cake showing golden crumb structure and honeyed caramel glaze.',
    duration: '0:30',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/product/butter series/pure butter.png',
    status: 'interactive_canvas_live',
    theme: 'butter-gold',
    captions: [
      { start: 0, end: 10, text: '100% Pure European Butter. No margarine. No compromises.' },
      { start: 10, end: 20, text: 'A dense yet melt-in-your-mouth crumb finished with edible 24K gold leaf.' },
      { start: 20, end: 30, text: 'All varieties at verified RM79. Order fresh via WhatsApp.' }
    ]
  },
  {
    id: 'brownies-commercial',
    title: 'Fudgy Brownies — 70% Callebaut Indulgence',
    category: 'Product Commercial',
    description: 'Cracking shiny papery brownie crust revealing fudgy chocolate interior drizzled with glossy sea salt chocolate ganache.',
    duration: '0:30',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/product/brownies/brownies 1.png',
    status: 'interactive_canvas_live',
    theme: 'chocolate',
    captions: [
      { start: 0, end: 12, text: 'Intensely chocolate. Fudgy, chewy center with a paper-thin shiny crust.' },
      { start: 12, end: 30, text: 'RM59 standard slab or custom celebratory brownie towers.' }
    ]
  },
  {
    id: 'pavlova-commercial',
    title: 'Pavlova Pudding Cake — Cloud of Fresh Berries',
    category: 'Product Commercial',
    description: 'Crisp marshmallow meringue base crowned with fresh whipped cream and vibrant ruby strawberries, blueberries, and kiwi.',
    duration: '0:30',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/product/pavlova pudding cake/strawberry pavlova pudding cake.jpg',
    status: 'interactive_canvas_live',
    theme: 'strawberry-luxury',
    captions: [
      { start: 0, end: 12, text: 'Crisp delicate meringue shell concealing a soft, pillowy marshmallow core.' },
      { start: 12, end: 30, text: 'Adorned with glazed ruby strawberries and fresh fruits. RM88 across all flavours.' }
    ]
  },
  {
    id: 'tart-commercial',
    title: 'Artisan Tarts — Molten Cheese & Glazed Fruits',
    category: 'Product Commercial',
    description: 'Close-up of golden fluted shortcrust pastry shells filled with molten baked cheese and vibrant fruit jewels.',
    duration: '0:30',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/product/cheese tart/blueberry cheese tart.png',
    status: 'interactive_canvas_live',
    theme: 'patisserie',
    captions: [
      { start: 0, end: 14, text: 'Fluted buttery shortcrust shells baked golden with rich molten cheese.' },
      { start: 14, end: 30, text: 'Cheese, Fruit, and Egg Tarts. Handcrafted in batches of 10 or celebratory 100+ platters.' }
    ]
  },
  {
    id: 'dessert-corner-commercial',
    title: 'Dessert Corner — Celebration Table Styling',
    category: 'Event Commercial',
    description: 'Full-table event setup featuring tiered acrylic stands, fresh floral runners, golden cake risers, and guest celebration moments.',
    duration: '0:45',
    resolution: '3840x2160 4K UHD',
    aspectRatio: '16:9',
    poster: 'images/dessert-corner/package-a.jpg',
    status: 'interactive_canvas_live',
    theme: 'celebration',
    captions: [
      { start: 0, end: 12, text: 'Transform your weddings, birthdays, and corporate events into sweet luxury.' },
      { start: 12, end: 28, text: 'Curated packages from Budget RM200 to Royal Package C RM750.' },
      { start: 28, end: 45, text: 'Full table styling, stands, and delivery across Klang Valley.' }
    ]
  },
  {
    id: 'bakery-prep-sequence',
    title: 'Dawn at Veni Delights — Kitchen Morning Routine',
    category: 'Documentary',
    description: 'The sensory rhythm of our Klang kitchen: egg cracking, sugar whipping, pandan boiling, oven timer bells, and signature box ribbons.',
    duration: '0:40',
    resolution: '1920x1080 Full HD',
    aspectRatio: '16:9',
    poster: 'images/hero/hero-5.png',
    status: 'interactive_canvas_live',
    theme: 'documentary',
    captions: [
      { start: 0, end: 15, text: '4:30 AM in Klang: the ovens are warm and the butter is weighed.' },
      { start: 15, end: 30, text: 'No shortcuts, no artificial essences — only patient, honest craftsmanship.' },
      { start: 30, end: 40, text: 'Every box tied with our signature gold ribbon and sent with love.' }
    ]
  }
];
