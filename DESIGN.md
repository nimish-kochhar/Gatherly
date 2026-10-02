# Gatherly Design System

> **This document is the source of truth for all UI decisions.**
> Before modifying any component or writing any new UI code, read this document.
> Do not invent new design tokens. Work within what is defined here.

---

## 1. Visual Principles

Gatherly's UI is **functional-first, quietly refined**. The aesthetic communicates clarity and trust without being flashy. Key principles:

- **Hierarchy over decoration** — visual weight should always guide attention to the most important element, not to decorative chrome.
- **Dark mode is primary** — the app defaults to dark mode. Light mode is supported and equally maintained.
- **Restraint** — animations exist to give feedback and communicate state, not to impress. They are fast and subtle.
- **Accessibility is not optional** — every interactive element must be reachable by keyboard and screen reader.

---

## 2. Color System

### 2.1 Semantic Token Usage

Always use Gatherly's semantic Tailwind tokens. **Never use raw Tailwind default colors** (gray, slate, blue, zinc, etc.) in new or refactored components.

| Token family | Purpose |
|---|---|
| `primary-*` | Brand, interactive actions, links, active states |
| `accent-*` | Secondary actions, callouts, highlights |
| `surface-*` | Backgrounds, borders, text hierarchy |
| `success-*` | Positive feedback, joined/following states |
| `danger-*` | Destructive actions, errors, downvotes |

### 2.2 Primary — Blue (#3b82f6 at 500)

Used for: CTAs, links, active nav items, focus rings, vote highlights.

```
primary-50   #eef5ff    (light bg tint)
primary-500  #3b82f6   <- interactive default
primary-600  #2563eb   <- button bg
primary-700  #1d4ed8   <- active/pressed
```

### 2.3 Accent — Orange (#f97316 at 500)

Used for: secondary highlights, badges, community icons.

```
accent-500   #f97316
accent-600   #ea580c
```

### 2.4 Surface — Zinc scale

The full surface ramp drives backgrounds, cards, borders, and text shading.

```
surface-50   #fafafa    <- light page bg
surface-100  #f4f4f5
surface-200  #e4e4e7   <- light borders
surface-400  #a1a1aa   <- secondary text (light)
surface-500  #71717a   <- muted text
surface-600  #52525b   <- icon inactive (dark)
surface-700  #3f3f46   <- dark borders
surface-800  #27272a   <- dark secondary bg
surface-850  #1e1e24   <- dark card bg
surface-900  #18181b   <- dark primary bg
surface-950  #0f0f12   <- darkest bg
```

### 2.5 State Colors

| Token | Hex | Use |
|---|---|---|
| `success-500` | #22c55e | Online status, joined state |
| `success-600` | #16a34a | Success button bg |
| `danger-400`  | #f87171 | Downvote highlight |
| `danger-500`  | #ef4444 | Error states |
| `danger-600`  | #dc2626 | Destructive button bg |

### 2.6 CSS Custom Properties

Defined in `src/styles/index.css`. Flip automatically between light and dark:

```
--color-bg              Page background
--color-bg-secondary    Secondary background
--color-text            Primary text
--color-text-secondary  Muted text
--color-border          Default border
--color-card-bg         Card background
```

Use these through the pre-defined component classes (`.card`, `.skeleton`, etc.) or
via `rgb(var(--color-bg))` where needed.

### 2.7 Prohibited Raw Colors

Do NOT use these Tailwind color families in new or refactored code:

- `gray-*`  -> use `surface-*`
- `slate-*` -> use `surface-*`
- `blue-*`  -> use `primary-*`
- `zinc-*`  -> use `surface-*`
- `green-*` -> use `success-*`
- `red-*`   -> use `danger-*`

Exception: `purple-*` and `pink-*` are acceptable for community icon gradient
variety in CommunityCard. No new exceptions without discussion.

---

## 3. Typography

### 3.1 Font

**Inter** loaded from Google Fonts in `index.html` (weights: 400, 500, 600, 700, 800).
`font-sans` maps to `['Inter', 'system-ui', '-apple-system', 'sans-serif']`.
All elements inherit this. Do not use other font families.

### 3.2 Type Scale

Custom addition: `text-2xs` = 0.625rem / 0.875rem line-height.

| Class | Use |
|---|---|
| `text-2xs` | Micro-labels, status indicators |
| `text-xs`  | Secondary labels, timestamps, captions |
| `text-sm`  | Body text, list items, button labels |
| `text-base`| Primary post content |
| `text-lg`  | Section headings, modal titles |
| `text-xl`  | Page headings |
| `text-2xl+`| Hero headings (Landing page only) |

### 3.3 Weight Conventions

| Weight | Class | Use |
|---|---|---|
| 400 | `font-normal`    | Body copy |
| 500 | `font-medium`    | Labels, nav items, button text |
| 600 | `font-semibold`  | Section titles, card titles, usernames |
| 700 | `font-bold`      | Page headings, logo |
| 800 | `font-extrabold` | Hero text (Landing only) |

---

## 4. Spacing

Standard Tailwind scale applies. Custom tokens:

| Token | Value | Context |
|---|---|---|
| `18`  | 4.5rem | Navbar height (h-14 = 56px) |
| `88`  | 22rem  | Sidebar width region |
| `112` | 28rem  | Mid sidebar panels |
| `128` | 32rem  | Modal max widths |

Card internal padding: `p-4`. Modal bodies: `p-6`.

---

## 5. Border Radius

| Class | Value | Use |
|---|---|---|
| `rounded-lg`  | 0.5rem  | Inputs, buttons, dropdowns |
| `rounded-xl`  | 0.75rem | Cards (`.card` class) |
| `rounded-2xl` | 1rem    | Dialogs/modals |
| `rounded-full`| 9999px  | Avatars, vote buttons |
| `rounded-4xl` | 2rem    | Large hero cards (Landing) |

---

## 6. Shadows

| Class | Use |
|---|---|
| `shadow-card`           | Default card shadow (light) |
| `shadow-card-hover`     | Card hover elevation (light) |
| `shadow-dark-card`      | Default card shadow (dark) |
| `shadow-dark-card-hover`| Card hover elevation (dark) |
| `shadow-glow`           | Blue glow for interactive highlights |
| `shadow-glow-lg`        | Larger glow for featured elements |

Prefer the `.card` component class over manual shadow classes on card elements.
It handles shadow switching automatically.

---

## 7. Iconography

**Library:** `lucide-react`

- All icons must use Lucide. Do not write inline SVG paths in new components.
- Standard sizes: `w-4 h-4` (small), `w-5 h-5` (standard), `w-6 h-6` (large).
- Icon-only interactive elements require:
  - `aria-label` on the interactive element
  - `aria-hidden="true"` on the icon
  - `<Tooltip>` wrapper from `components/ui/tooltip.jsx`

```jsx
// Correct
<Tooltip content="Create Post">
  <button aria-label="Create Post">
    <Plus className="w-5 h-5" aria-hidden="true" />
  </button>
</Tooltip>

// Wrong — do not write raw SVG paths in components
<button>
  <svg viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
</button>
```

---

## 8. Component Conventions

### 8.1 Retained Custom Components (`/components/common/`)

| Component | Notes |
|---|---|
| `Button`  | Variants: primary, secondary, ghost, danger. Sizes: sm/md/lg. Retained as-is. |
| `Avatar`  | Initials fallback, deterministic color from name. Retained as-is. |
| `Loader`  | Spinner + skeleton + card-skeleton variants. Retained as-is. |
| `Modal`   | Legacy — for new dialogs, prefer `Dialog` from `components/ui`. |

### 8.2 UI Primitives (`/components/ui/`)

Radix-based, Gatherly-token-adapted:

| Component      | Based On              | Purpose |
|---|---|---|
| `DropdownMenu` | Radix DropdownMenu    | Accessible dropdown menus |
| `Dialog`       | Radix Dialog          | Focus-trapped modals |
| `Tooltip`      | Radix Tooltip         | Icon-button tooltips |
| `Input`        | Native `<input>`      | Standardized form input |

Import: `import { Dialog, Tooltip, Input } from '../components/ui'`

### 8.3 `cn()` for class composition

Every reusable component that accepts `className` must use `cn()`:

```js
import { cn } from '../../utils/cn.js';
// or from the barrel:
import { cn } from '../../utils';

function MyComponent({ className }) {
  return <div className={cn('base-classes', className)} />;
}
```

### 8.4 Feature Components

Each feature folder (`/post`, `/community`, `/chat`, `/profile`) owns its components.
Do not add feature-specific components to `/common`.

---

## 9. Responsive Behavior

| Prefix | Min-width | Context |
|---|---|---|
| (none) | — | Mobile first |
| `sm:`  | 640px | Large phones |
| `md:`  | 768px | Tablets |
| `lg:`  | 1024px | Laptops |
| `xl:`  | 1280px | Desktops |

Authenticated layout: `Sidebar (w-64) | Content (flex-1) | optional right rail`.

- Sidebar hides on mobile: `hidden lg:block`.
- Feed grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.
- Max content width: `max-w-[1400px] mx-auto`.

---

## 10. Accessibility

Minimum requirements for all UI contributions:

1. Every interactive element is keyboard-reachable (Tab order).
2. Focus rings: `focus-visible:ring-2 focus-visible:ring-primary-500` (global in index.css).
3. All icon-only buttons/links have `aria-label`.
4. Decorative icons have `aria-hidden="true"`.
5. Semantic HTML: `<button>` for actions, `<a>` for navigation, `<article>` for feed items, `<nav>` for navigation, `<aside>` for sidebar.
6. **No nested interactive elements.** Never put a `<button>` or `<a>` inside another `<a>`. Use the block-link (CSS `::after` stretch) pattern for clickable cards.
7. Dynamic count updates use `aria-live="polite" aria-atomic="true"`.
8. WCAG AA color contrast for all text.

### Block-link Pattern (for clickable cards)

```jsx
<article className="relative">
  <h3>
    <Link
      to="/post/123"
      className="after:absolute after:inset-0 after:content-['']"
    >
      Post Title
    </Link>
  </h3>
  {/* Buttons use z-[1] to sit above the stretched link */}
  <button className="relative z-[1]">Vote</button>
</article>
```

---

## 11. Animation

**Package:** `motion` — always import from `motion/react`.

```js
// Correct
import { motion, AnimatePresence } from 'motion/react';

// Wrong — deprecated package name
import { motion } from 'framer-motion';
```

### 11.1 Principles

- Animations communicate state, not style.
- Durations: micro-interactions 100–200ms, transitions 250–350ms, reveals up to 500ms.
- Easing: `ease-out` for entrances, `ease-in` for exits.
- No animation without semantic purpose.

### 11.2 Tailwind CSS Animations (prefer for simple cases)

| Class | Duration | Use |
|---|---|---|
| `animate-fade-in`      | 200ms | General appear |
| `animate-fade-in-up`   | 300ms | Content reveal |
| `animate-fade-in-down` | 200ms | Dropdown menus |
| `animate-scale-in`     | 200ms | Modal appear |
| `animate-shimmer`      | 1.5s  | Skeleton loaders |

### 11.3 When to use Motion

Use `motion/react` for: layout animations, list insertion/removal, shared element
transitions, gesture-driven interactions, staggered reveals.

---

## 12. Pre-defined CSS Classes

From `src/styles/index.css`:

| Class | Purpose |
|---|---|
| `.card` | Card bg + border + shadow + hover shadow |
| `.skeleton` | Shimmer placeholder |
| `.divider` | Horizontal rule |
| `.text-secondary` | Muted text via CSS variable |
| `.interactive` | Hover bg tint + active scale |
| `.glass` | Backdrop blur + semi-transparent bg |
| `.scrollbar-thin` | Styled thin scrollbar |
| `.scrollbar-hide` | Hidden scrollbar |
