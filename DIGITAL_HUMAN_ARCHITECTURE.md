# DIGITAL HUMAN ARCHITECTURE — Veni Delights

**Implementation:** `src/js/avatar3d.js`  
**Engine:** Three.js WebGL (Perspective Camera, Studio Lighting, Procedural Skeleton)  
**Roles:** Veni Host, Master Baker, Dessert Specialist

---

## 1. Architectural Overview

The Veni Delights Digital Human system creates a living brand presence that elevates the website from a passive catalogue into an engaging, hospitable consultation experience.

```
+-----------------------------------------------------------+
|                   VeniDigitalHuman Class                  |
+-----------------------------------------------------------+
         |                        |                    |
         v                        v                    v
  [Render Loop]            [Rigging System]     [Speech & Audio Engine]
  - 60 FPS RequestAnim     - Head & Neck        - Web Speech API
  - ACESFilmic ToneMap     - Eyeball & Pupil    - Subtitle Synchronizer
  - Dual Shadows           - Eyelid Blendshape  - Mute/Unmute Controls
  - Soft Ambient Light     - Phoneme Mouth Jaw  - Persona Voice Tuning
         |                        |                    |
         +------------------------+--------------------+
                                  |
                                  v
                    [3 Persona Specializations]
         +------------------------+------------------------+
         |                        |                        |
         v                        v                        v
    [Veni Host]            [Master Baker]         [Dessert Specialist]
   - Concierge Lead       - Artisan Storyteller   - Event Table Curator
   - Onyx Black Uniform   - Chocolate Chef Jacket - Midnight Blue Uniform
   - Welcome & Journey    - Butter & Brownies     - Pavlova & Event Table
```

---

## 2. Skeletal & Facial Blendshape Specifications

### Anatomy Rig
- **Head Base:** Scaled ellipsoid (`SphereGeometry(0.23, 32, 32)` with anisotropic scaling `0.92, 1.15, 1.0`)
- **Neck & Torso:** Articulated dual cylinder joints with collar and golden buttons
- **Artisan Toque (Chef Hat):** Classical French toque with pleated crown and golden Veni emblem
- **Eyes System:**
  - Sclera with specular highlight reflections
  - Deep espresso iris with pupil depth
  - Cornea gloss reflection glint
  - Dynamic gaze tracking reacting smoothly to visitor mouse coordinates
- **Eyelids (Blinking Blendshape):**
  - Smooth trigonometric blink cycle firing pseudo-randomly every 2.5 to 6 seconds
  - Sub-frame interpolation ensuring natural human movement rather than abrupt switching
- **Mouth / Jaw Phoneme Rig:**
  - Dynamic mouth scaling responding to speech utterance playback
  - Returns to soft resting smile when idle

---

## 3. Persona Matrix

| Feature | Avatar 1: Veni Host | Avatar 2: Master Baker | Avatar 3: Dessert Specialist |
|---|---|---|---|
| Role | Front-of-house concierge | Back-of-house craftsman | Event & celebration curator |
| Chef Jacket Color | Onyx Black (`#111110`) | Chocolate Artisanal (`#2A1B14`)| Midnight Celebration (`#1A1C23`) |
| Emblem Trim | Antique Gold (`#C9A84C`) | Classic Gold (`#D4AF37`) | Champagne Bright (`#F0C860`) |
| Speech Pitch | 1.05 (Warm & Welcoming) | 0.92 (Rich & Grounded) | 1.10 (Enthusiastic & Refined) |
| Speech Rate | 0.95 | 0.92 | 0.98 |
| Core Focus | Guided discovery, FAQ | Butter Series, Brownies | Pavlova, Tarts, Dessert Corner |

---

## 4. Accessibility & Progressive Enhancement
1. **Low-Power / Mobile Fallback:**
   - Detects WebGL capability and browser constraints.
   - If WebGL is unavailable or fails to initialize, renders a stylish CSS animated portrait card.
2. **Audio Autonomy:**
   - Web Audio & Speech are muted by default to comply with WCAG 1.4.2 and modern browser autoplay policies.
   - User must explicitly toggle the audio control to activate spoken voice.
   - Closed captions are rendered in a dedicated HUD element.
3. **Reduced Motion:**
   - Detects `(prefers-reduced-motion: reduce)`.
   - Disables exaggerated camera sways, dampens breathing amplitudes, and eliminates sudden head rotations.
