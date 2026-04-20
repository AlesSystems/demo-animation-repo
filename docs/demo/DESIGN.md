# HyperFrames Demo — Visual Identity

## Style Prompt

A clean, minimal cinematic intro demonstrating HyperFrames fundamentals. Dark background with premium typography, smooth transitions, and deliberate pacing. Focuses on clarity over complexity — showing entrance animations, scene transitions, and GSAP choreography in real-time.

## Colors

- **Primary Background**: `#0a0e27` (deep navy)
- **Secondary Background**: `#1a1f3a` (slightly lighter navy for accents)
- **Text Primary**: `#e8eef7` (soft white, high contrast)
- **Accent**: `#00d9ff` (cyan, for highlights)
- **Transition Overlay**: `rgba(0, 217, 255, 0.1)` (subtle cyan overlay)

## Typography

- **Display Font**: `Inter` (bold, 80-120px)
- **Body Font**: `Inter` (regular, 18-24px)

## Motion Defaults

- **Entrance Duration**: 0.6-0.8s
- **Exit Duration**: 0.4-0.5s
- **Stagger Interval**: 120ms
- **Easing**: power3.out (entrances), power2.in (exits)
- **Transition Duration**: 0.8s

## What NOT to Do

1. ❌ Do NOT use full-screen linear gradients on dark backgrounds (H.264 banding)
2. ❌ Do NOT repeat the same easing on consecutive tweens
3. ❌ Do NOT forget `window.__timelines` registration
4. ❌ Do NOT use `repeat: -1` (always finite repeats)
5. ❌ Do NOT exit scenes before transitions fire
