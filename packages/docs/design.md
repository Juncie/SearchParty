# Design System

## Overview

Search Party is a focused, high-performance interface for job discovery and automation.

The design prioritizes:

- Speed
- Clarity
- Actionability

This is not a decorative UI — it is a tool. Every element should serve a purpose.

Dark-first, minimal, and structured for high information density.

---

## Colors

- **Primary** (#10B981)  
  Used for success states, primary actions, confirmations, and progress indicators.
- **Secondary** (#64748B)  
  Supporting UI elements such as icons, labels, inactive states.
- **Surface** (#0A0F1E)  
  Main application background.
- **Surface Variant** (#111827)  
  Cards, containers, modals, and grouped UI elements.
- **On Surface** (#E5E7EB)  
  Primary readable text on dark backgrounds.
- **Muted** (#9CA3AF)  
  Placeholder text, secondary descriptions, low-emphasis content.
- **Error** (#F87171)  
  Validation errors, destructive actions, warnings.

---

## Typography

- **Font Family**: Inter

### Type Scale

- **H1**: 3rem / 48px / Semi-Bold
- **H2**: 2rem / 32px / Semi-Bold
- **H3**: 1.75rem / 28px / Medium
- **H4**: 1.5rem / 24px / Medium
- **H5**: 1.375rem / 22px / Medium
- **H6**: 1.175rem / 20px / Medium
- **Body (md)**: 1rem / 16px / Regular
- **Body (sm)**: 0.875rem / 14px / Regular
- **Label**: 0.75rem / 12px / Medium / Uppercase

### Usage

- Headlines should be concise and action-oriented
- Avoid long paragraphs — prioritize scanability
- Use muted text for supporting info, never for primary content

---

## Layout & Spacing

- Base unit: **4px**
- Common spacing:
  - 8px (tight spacing)
  - 12px (component padding)
  - 16px (default spacing)
  - 24px (section spacing)
  - 32px+ (layout separation)
- Max width for main content: **1200px**
- Use consistent padding across views

---

## Components

### Buttons

- Radius: 10px
- Height: 36–44px

**Variants:**

- Primary: Green fill (#10B981), dark text
- Secondary: Transparent with border
- Ghost: No background, subtle hover

**States:**

- Hover → slight brightness increase
- Active → darker shade
- Disabled → reduced opacity (40%)

---

### Inputs

- Background: Surface Variant (#111827)
- Border: 1px solid rgba(255,255,255,0.08)
- Radius: 10px
- Padding: 10–12px

**States:**

- Focus: Border becomes primary color
- Error: Border switches to error color

---

### Cards

- Background: Surface Variant
- Border: 1px solid rgba(255,255,255,0.06)
- Radius: 12px
- Padding: 16px

No shadows — hierarchy is created through contrast and spacing.

---

### Chips / Tags

- Background: rgba(255,255,255,0.05)
- Text: Muted or secondary
- Radius: Full (pill)
- Used for:
  - Job tags
  - Status indicators
  - Filters

---

### Navigation

- Minimal, left-aligned or top bar
- Active state indicated by:
  - Color change (primary)
  - Subtle background highlight

---

## Interaction Principles

- Fast feedback > fancy animation
- Prefer instant UI response over delayed transitions
- Animations (if used):
  - Duration: 120–180ms
  - Ease: ease-out
  - Subtle only (opacity, translate)

---

## Do’s and Don’ts

### Do

- Use color intentionally (especially primary)
- Keep UI tight and efficient
- Prioritize readability and hierarchy
- Design for power users and speed

### Don’t

- Overuse color or gradients
- Add unnecessary shadows or elevation
- Mix inconsistent border radii
- Create dead space without purpose

---

## Accessibility

- Maintain minimum **4.5:1 contrast ratio** for body text
- Interactive elements must have visible focus states
- Avoid relying on color alone for meaning
- Ensure clickable targets are at least 36px height

---

## Brand Feel

Search Party should feel:

- Fast
- Tactical
- Smart
- Focused

Not:

- Playful
- Decorative
- Overdesigned

This is a tool for people trying to win — design accordingly.

# Search Party — Design System

---

# Brand Overview

Search Party is a modern, intelligent job-hunting assistant.

The brand should feel:

- Fast
- Smart
- Trustworthy
- Minimal
- Professional (but not corporate-stiff)

Tone:

> “You’re in control. We make it easier.”

---

# Brand Personality

| Trait       | Description                       |
| ----------- | --------------------------------- |
| Confident   | Clear, direct, no fluff           |
| Helpful     | Guides, doesn’t overwhelm         |
| Intelligent | Feels like a smart assistant      |
| Minimal     | Clean UI, no clutter              |
| Modern      | Slightly technical, product-first |

---

# Visual Direction

## Core Feel

- Dark UI first (developer-friendly, modern)
- Subtle gradients
- Minimal borders
- Soft shadows
- Strong typography hierarchy

---

# Color System

## Primary Colors

```css
--background-primary: #171717;
--background-secondary: #1f1f1f;
--background-tertiary: #262626;

--text-primary: #ffffff;
--text-secondary: #a3a3a3;
--text-muted: #6b7280;
```

## Accent Colors

```css
--accent-primary: #10b981; /* Emerald / success */
--accent-hover: #059669;
--accent-secondary: #3b82f6; /* Blue for actions */
--accent-warning: #f59e0b;
--accent-danger: #ef4444;
```

## Gradients

```css
--gradient-primary: linear-gradient(
  135deg,
  #10b981,
  #3b82f6
);
--gradient-subtle: linear-gradient(
  180deg,
  #171717,
  #262626
);
```

---

# Typography

## Font stack

```css
font-family:
  Inter,
  system-ui,
  -apple-system,
  sans-serif;
```

## Type scale

| Usage | Size    | Weight |
| ----- | ------- | ------ |
| Hero  | 36–48px | 700    |
| H1    | 28–32px | 600    |
| H2    | 22–26px | 600    |
| H3    | 18–20px | 500    |
| Body  | 14–16px | 400    |
| Small | 12–13px | 400    |

## Style rules

- Headlines: slightly tight letter spacing
- Body: relaxed readability
- Avoid excessive bolding
- Use uppercase sparingly for emphasis

---

# Spacing System

Use an **8px grid**:

| Token | Use             |
| ----- | --------------- |
| 4px   | Micro spacing   |
| 8px   | Tight spacing   |
| 16px  | Default spacing |
| 24px  | Section spacing |
| 32px  | Large spacing   |
| 48px  | Layout spacing  |

---

# Layout Principles

## Rules

- Keep layouts narrow and focused
- Avoid dense UI
- Always prioritize clarity over features
- Use whitespace aggressively

---

# Components

## Buttons

### Primary button

- Background: accent primary
- Text: white
- Radius: 10–14px
- Padding: 10px 16px

**Hover:**

- Slight darken
- Subtle scale (1.02)

### Secondary button

- Background: transparent
- Border: 1px solid `#2a2a2a`
- Text: white

### Ghost button

- No background; text only
- Used for low-priority actions

## Inputs

- Background: `#1f1f1f`
- Border: 1px solid `#2a2a2a`
- Radius: 10px
- Padding: 10px 12px

**Focus:**

- Border: accent primary
- Glow: subtle

## Cards

- Background: `#1f1f1f`
- Border radius: 14–18px
- Padding: 16–20px
- Shadow: very subtle

**Used for:**

- Profiles
- Job cards
- Application entries

## Tags / pills

**Used for:**

- Skills
- Status
- Labels

**Style:**

- Background: `#262626`
- Radius: 999px
- Padding: 4px 10px
- Text: small

---

# Iconography

## Style

- Minimal
- Outline-based
- Consistent stroke width (1.5–2px)

## Icon themes

- Search / radar
- Compass / direction
- Target / focus
- Briefcase
- Lightning (speed)
- AI / assistant (subtle)

**Implementation:** `lucide-react` or similar

---

# Motion & interaction

## Principles

- Fast, not flashy
- Subtle transitions
- Immediate feedback

## Animations

- Hover scale: 1.01–1.03
- Fade transitions: 150–250ms
- Slide-ins: subtle (`y`: 4–8px)

---

# Chrome extension UI

## Side panel design

**Sections:**

- Profile selector
- Job info
- Autofill suggestions
- Actions

## Priority actions

- Autofill application
- Generate cover letter
- Save application

## Behavior

- Persistent panel
- Fast updates
- Minimal clutter

---

# Accessibility

- Contrast ratio ≥ 4.5:1
- Keyboard navigable
- Focus states visible
- Avoid color-only meaning

---

# Design principles summary

- Clarity > complexity
- Speed > decoration
- Function > flash
- Assist > control
- Minimal > dense
