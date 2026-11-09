/**
 * VENI DELIGHTS — DYNAMIC COLOR PALETTE & LUXURY THEME SWITCHER
 * Supports 3 Handcrafted Themes:
 * 1. 'dark' (Default): Dark Onyx Strawberry & Gold Patisserie
 * 2. 'white-strawberry': Luminous White Strawberry & Vanilla Cream Pearl
 * 3. 'royal-pandan': Imperial Royal Emerald & Golden Pandan
 */

export class ThemeSwitcher {
  constructor() {
    this.storageKey = 'veni_delights_theme';
    this.currentTheme = localStorage.getItem(this.storageKey) || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme, false);
    this.bindEvents();
  }

  applyTheme(theme, animate = true) {
    if (!['dark', 'white-strawberry', 'royal-pandan'].includes(theme)) {
      theme = 'dark';
    }

    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);

    // Sync all theme switchers in DOM
    document.querySelectorAll('.theme-swatch-btn').forEach(btn => {
      const isActive = btn.dataset.theme === theme;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // Notify any listeners (canvas, 3d scenes)
    window.dispatchEvent(new CustomEvent('veni-theme-change', { detail: { theme } }));
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.theme-swatch-btn');
      if (btn && btn.dataset.theme) {
        this.applyTheme(btn.dataset.theme, true);
      }
    });
  }
}
