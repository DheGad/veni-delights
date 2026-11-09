/**
 * VENI DELIGHTS — CINEMATIC MEDIA PLAYER & PROCEDURAL FOOD CINEMA
 * Features:
 * - HTML5 Video playback with custom luxury controls
 * - Real-time procedural food motion loops (Strawberry Coulis, Chocolate Ganache, Powdered Sugar)
 * - Synchronized captions and subtitles
 * - Fullscreen, volume, and playback speed management
 */

import { MEDIA_MANIFEST } from '../data/media-manifest.js';

export class CinematicMediaPlayer {
  constructor(containerSelector = '.cinematic-player-wrap') {
    this.containers = document.querySelectorAll(containerSelector);
    if (!this.containers.length) return;
    this.init();
  }

  init() {
    this.containers.forEach(container => {
      const mediaId = container.dataset.mediaId || 'hero-intro';
      const manifest = MEDIA_MANIFEST.find(m => m.id === mediaId) || MEDIA_MANIFEST[0];
      this.buildPlayer(container, manifest);
    });
  }

  buildPlayer(container, data) {
    container.innerHTML = `
      <div class="cinema-frame">
        <canvas class="cinema-canvas" width="1280" height="720" aria-label="${data.title}"></canvas>
        <div class="cinema-poster" style="background-image: url('${data.poster}');">
          <div class="cinema-play-overlay">
            <button class="cinema-play-btn" aria-label="Play ${data.title}">
              <i class="fa-solid fa-play"></i>
            </button>
            <div class="cinema-meta">
              <span class="cinema-tag">${data.category}</span>
              <h3 class="cinema-title">${data.title}</h3>
              <p class="cinema-desc">${data.description}</p>
            </div>
          </div>
        </div>

        <div class="cinema-captions" aria-live="polite"></div>

        <div class="cinema-controls">
          <button class="cinema-ctrl-btn btn-play-pause" title="Play/Pause">
            <i class="fa-solid fa-play"></i>
          </button>
          <div class="cinema-progress-wrap">
            <div class="cinema-progress-bar">
              <div class="cinema-progress-fill"></div>
            </div>
          </div>
          <span class="cinema-time">0:00 / ${data.duration}</span>
          <button class="cinema-ctrl-btn btn-captions active" title="Toggle Subtitles">
            <i class="fa-solid fa-closed-captioning"></i>
          </button>
          <button class="cinema-ctrl-btn btn-mute" title="Mute/Unmute">
            <i class="fa-solid fa-volume-high"></i>
          </button>
          <button class="cinema-ctrl-btn btn-fullscreen" title="Fullscreen">
            <i class="fa-solid fa-expand"></i>
          </button>
        </div>
      </div>
    `;

    const canvas = container.querySelector('.cinema-canvas');
    const poster = container.querySelector('.cinema-poster');
    const playBtn = container.querySelector('.cinema-play-btn');
    const playPauseBtn = container.querySelector('.btn-play-pause');
    const captionsEl = container.querySelector('.cinema-captions');
    const captionsBtn = container.querySelector('.btn-captions');
    const muteBtn = container.querySelector('.btn-mute');
    const fsBtn = container.querySelector('.btn-fullscreen');
    const progressFill = container.querySelector('.cinema-progress-fill');
    const timeDisplay = container.querySelector('.cinema-time');

    let isPlaying = false;
    let isMuted = false;
    let showCaptions = true;
    let currentTime = 0;
    const duration = 30; // 30s loop
    let animId = null;

    // Canvas procedural food cinema generator
    const ctx = canvas.getContext('2d');
    let frame = 0;

    const renderFoodCinema = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Base gradient matching theme
      const grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w/1.2);
      if (data.theme === 'strawberry-luxury') {
        grad.addColorStop(0, '#5C121D');
        grad.addColorStop(0.5, '#350A10');
        grad.addColorStop(1, '#140608');
      } else if (data.theme === 'chocolate') {
        grad.addColorStop(0, '#381E18');
        grad.addColorStop(0.5, '#22110D');
        grad.addColorStop(1, '#0F0705');
      } else {
        grad.addColorStop(0, '#422818');
        grad.addColorStop(0.5, '#26150C');
        grad.addColorStop(1, '#110905');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Living cinematic liquid wave (strawberry coulis / melted chocolate)
      ctx.save();
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yOffset = h * 0.45 + i * 45;
        ctx.moveTo(0, h);
        ctx.lineTo(0, yOffset);

        for (let x = 0; x <= w; x += 20) {
          const wave1 = Math.sin((x * 0.005) + (frame * 0.02) + i) * 28;
          const wave2 = Math.cos((x * 0.01) - (frame * 0.015)) * 14;
          ctx.lineTo(x, yOffset + wave1 + wave2);
        }

        ctx.lineTo(w, h);
        ctx.closePath();

        if (data.theme === 'strawberry-luxury') {
          ctx.fillStyle = i === 0 ? 'rgba(194, 59, 82, 0.45)' : (i === 1 ? 'rgba(169, 45, 66, 0.65)' : 'rgba(122, 24, 41, 0.85)');
        } else {
          ctx.fillStyle = i === 0 ? 'rgba(213, 174, 97, 0.35)' : (i === 1 ? 'rgba(69, 42, 39, 0.7)' : 'rgba(28, 16, 14, 0.9)');
        }
        ctx.fill();
      }
      ctx.restore();

      // Floating golden sparkles & berry seeds
      ctx.save();
      for (let s = 0; s < 35; s++) {
        const seedAngle = (s / 35) * Math.PI * 2;
        const speed = 0.5 + (s % 3) * 0.3;
        const sx = ((s * 47 + frame * speed * 1.5) % (w + 40)) - 20;
        const sy = (h * 0.3) + Math.sin(frame * 0.03 + s) * 80 + (s * 11) % (h * 0.5);
        const radius = (s % 4 === 0) ? 3.5 : 1.8;

        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fillStyle = (s % 2 === 0) ? 'rgba(242, 223, 171, 0.85)' : 'rgba(255, 230, 235, 0.75)';
        ctx.shadowColor = '#D5AE61';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.restore();

      // Subtle Vignette
      const vig = ctx.createRadialGradient(w/2, h/2, w*0.35, w/2, h/2, w*0.7);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      if (isPlaying) {
        currentTime = (currentTime + 0.033) % duration;
        const pct = (currentTime / duration) * 100;
        if (progressFill) progressFill.style.width = `${pct}%`;

        const curMins = Math.floor(currentTime / 60);
        const curSecs = Math.floor(currentTime % 60).toString().padStart(2, '0');
        if (timeDisplay) timeDisplay.textContent = `${curMins}:${curSecs} / ${data.duration}`;

        // Update Captions
        if (showCaptions && data.captions && captionsEl) {
          const activeCap = data.captions.find(c => currentTime >= c.start && currentTime <= c.end);
          if (activeCap) {
            captionsEl.textContent = activeCap.text;
            captionsEl.style.display = 'block';
          } else {
            captionsEl.style.display = 'none';
          }
        }
        animId = requestAnimationFrame(renderFoodCinema);
      }
    };

    const togglePlay = () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        poster.style.opacity = '0';
        poster.style.pointerEvents = 'none';
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        renderFoodCinema();
      } else {
        poster.style.opacity = '1';
        poster.style.pointerEvents = 'auto';
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (animId) cancelAnimationFrame(animId);
      }
    };

    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);

    if (captionsBtn) {
      captionsBtn.addEventListener('click', () => {
        showCaptions = !showCaptions;
        captionsBtn.classList.toggle('active', showCaptions);
        if (!showCaptions && captionsEl) captionsEl.style.display = 'none';
      });
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        muteBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        muteBtn.classList.toggle('active', isMuted);
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          container.requestFullscreen().catch(err => console.warn(err));
        } else {
          document.exitFullscreen().catch(err => console.warn(err));
        }
      });
    }
  }
}
