---
name: Kinetic Stadium
colors:
  surface: '#111316'
  surface-dim: '#111316'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#c2c6d8'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#8c90a1'
  outline-variant: '#424656'
  surface-tint: '#b3c5ff'
  primary: '#b3c5ff'
  on-primary: '#002b75'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#0054d6'
  secondary: '#ffb59a'
  on-secondary: '#5a1b00'
  secondary-container: '#ff5e07'
  on-secondary-container: '#531900'
  tertiary: '#00dbe9'
  on-tertiary: '#00363a'
  tertiary-container: '#007e86'
  on-tertiary-container: '#e3fdff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb59a'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#802a00'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#111316'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display-xl:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  data-mono:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Lexend
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is engineered for the high-intensity atmosphere of major sporting venues. It targets fans who demand instant access to real-time data, seat-side services, and immersive event coverage. The personality is "Aggressive Innovation"—combining the raw energy of live sports with the precision of high-end aerospace interfaces.

The visual language utilizes **Glassmorphism** as its primary structural driver. By layering translucent surfaces over vibrant, moving backgrounds, the UI maintains a sense of depth and speed. This approach ensures that even data-heavy screens feel light and breathable, evoking a futuristic, high-tech stadium experience.

## Colors

The palette is optimized for a dark-mode-first environment, reflecting the high-contrast lighting of a stadium at night. 

- **Electric Blue (Primary):** Used for primary actions, active states, and critical paths. It represents the energy of the event.
- **Vibrant Orange (Secondary):** Reserved for high-alert notifications, live scores, and "hot" zones in heatmaps. It provides an aggressive contrast to the cool primary tones.
- **Deep Charcoal & Slate (Neutrals):** These form the base layers, providing a sophisticated, "stealth" aesthetic that allows content and data to pop.
- **Cyber Teal (Tertiary):** Used for secondary data visualizations, such as secondary progress bars or auxiliary stats.

## Typography

The typography strategy balances raw impact with technical clarity. 

**Space Grotesk** is used for all headings and display text. Its geometric, technical quirks reinforce the high-tech narrative and remain legible even when scaled to massive sizes on stadium jumbotrons or mobile headers.

**Lexend** is utilized for body copy and data-heavy sections. Designed for maximum readability and used frequently in athletic contexts, it provides the "functional UI" feel required for scanning player stats, seat numbers, or concession menus quickly. All labels and data points should lean on Lexend’s medium and semi-bold weights to ensure they don't disappear against dark backgrounds.

## Layout & Spacing

The layout utilizes a **fluid grid system** with a 12-column structure for tablet/web and a 4-column structure for mobile. A tight 4px baseline grid ensures mathematical precision in alignment.

Margins are kept relatively wide (20px) to prevent content from feeling cramped against the edge of the device, while gutters (16px) provide enough breathing room for glassmorphic cards to show their background blurs. Content should be grouped into "modules" that stack vertically, creating a clear stream of information that is easy to scroll during the fast-paced environment of a live game.

## Elevation & Depth

This design system eschews traditional shadows in favor of **Tonal Layering and Glassmorphism**. 

1.  **Level 0 (Base):** Deep Charcoal (#121417). The foundation of the UI.
2.  **Level 1 (Sub-surface):** Slightly lighter Slate. Used for inset areas or grouped background sections.
3.  **Level 2 (Glass Cards):** Translucent overlays (White @ 10% opacity) with a 20px background blur and a 1px thin white border (at 15% opacity). This creates the "frosted glass" effect.
4.  **Level 3 (Active Overlays):** Modals and high-priority cards use a stronger blur and a subtle Electric Blue inner glow to signify focus.

Depth is communicated through the intensity of the background blur—higher elevation elements have a more significant blur effect, making the background appear further away.

## Shapes

The shape language is **Rounded**, striking a balance between organic athletic movement and technical precision. 

Standard components (buttons, input fields) use a 0.5rem radius. Larger containers, such as Glassmorphic cards, utilize a 1rem (rounded-lg) or 1.5rem (rounded-xl) radius to soften the high-contrast aesthetic. Data visualization elements, such as progress bars, should use fully rounded "pill" ends to mimic the tracks and courts of the sporting world.

## Components

### Buttons
- **Primary:** Solid Electric Blue with white Lexend Bold text. No shadow; instead, use a subtle outer glow on hover.
- **Secondary:** Outlined with a 1px Electric Blue border and transparent background.
- **Action (Ghost):** Subtle slate background with high-transparency blur.

### Glass Cards
- All cards must feature a `backdrop-filter: blur(20px)`.
- Use a 1px stroke for the border to define the edge against dark backgrounds.
- Headers within cards should use Space Grotesk Bold.

### Data Visualizations
- **Heatmaps:** Use a gradient scale from Electric Blue (low) to Cyber Teal (mid) to Vibrant Orange (high).
- **Progress Bars:** Use a thick 8px stroke with rounded caps. The background track should be a dark slate, and the progress fill should be a gradient of Electric Blue to Cyber Teal.

### Inputs & Fields
- Dark backgrounds with a 1px border that shifts to Electric Blue on focus. 
- Labels are always positioned above the input in `label-sm` (Lexend, Uppercase).

### Venue-Specific Components
- **Seat Map:** Interactive SVG nodes. Selected seats glow with the Secondary Orange color.
- **Live Score Ticker:** A high-contrast, black-background bar at the top or bottom of the screen with a Vibrant Orange "LIVE" indicator.