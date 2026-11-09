# AVATAR ANIMATION MATRIX — Veni Delights

**Architecture Component:** `src/js/avatar3d.js`  
**Animation Subsystem:** Three.js Animation Loop & Procedural State Machine

---

## 1. Animation State Transitions

| State Name | Trigger | Blend Duration | Motion Characteristics | Eyeball / Gaze Behavior | Lip-Sync Activity |
|---|---|---|---|---|---|
| `idle` | Default ambient state | Continuous | Slow sinus breathing (1.8 rad/s, amplitude 0.015m); subtle torso sway | Micro-saccades tracking visitor cursor smoothly | Closed (soft resting smile) |
| `greet` | User loads page or switches persona | 400ms | Gentle head nod, eyebrow raise, cheerful posture | Direct eye contact with visitor | Active phoneme modulation for greeting phrase |
| `explain` | Concierge step advances | 300ms | Slight forward lean, head tilts 3-5 degrees | Focused on center viewport | Modulates with speech utterance duration |
| `think` | Processing user input | 350ms | Head tilts up-right, subtle eye shift away from center | Looks up and to the right momentarily | Paused |
| `talk` | Spoken narration active | Instantaneous | Articulated jaw opening/closing with harmonic vowel frequency | Follows cursor with subtle natural drift | Continuous phoneme scaling on Y and X axis |
| `celebrate` | Order submitted / package chosen | 500ms | Joyful head nod, wide smile blend, upright torso | Radiant direct gaze | Smiling phoneme shapes |

---

## 2. Blink Cycle Specifications
- **Frequency:** Pseudo-random Poisson-like distribution, interval between 2.5s and 6.0s.
- **Duration:** 160ms total (60ms closure, 20ms full close, 80ms reopening).
- **Blendshape Formula:**
  $$\theta_{eyelid}(t) = \theta_{open} + \max(0, \sin((t - t_{next}) \cdot 6\pi)) \cdot 0.65\text{ rad}$$

---

## 3. Cursor & Gaze Tracking Parameters
- **Deadzone:** 0.02 normalized viewport units (eliminates jitter on stationary mice).
- **Interpolation Easing (LERP):**
  $$\text{rot}_{target} = \text{rot}_{current} + (\text{pos}_{mouse} \cdot 0.35 - \text{rot}_{current}) \cdot 0.08$$
- **Max Pitch:** $\pm 14^\circ$
- **Max Yaw:** $\pm 22^\circ$
- **Roll Dampening:** $-0.05 \cdot x_{mouse}$ (counter-rotational natural neck stabilization).
