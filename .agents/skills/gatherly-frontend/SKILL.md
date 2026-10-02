---
name: gatherly-frontend
description: >
  Gatherly-specific rules for frontend development. Contains component
  organization conventions, semantic HTML requirements, styling rules,
  accessibility standards, animation patterns, and task boundaries for
  the Gatherly React/Vite/Tailwind codebase.
  Activate when writing, reviewing, or refactoring any frontend code in /client.
---

# Gatherly Frontend Skill

This skill covers Gatherly-specific frontend rules.
For global taste/aesthetic guidelines or Vercel interface patterns, consult the relevant global skills.

**Always read [`/DESIGN.md`](/DESIGN.md) before any UI work.**
**Always read [`/AGENTS.md`](/AGENTS.md) before starting any task.**

---

## 1. Component Organization

```
components/
  common/     — Avatar, Button, Loader, Modal (feature-agnostic only)
  ui/         — Radix primitives: Dialog, DropdownMenu, Tooltip, Input
  layout/     — Navbar, Sidebar, MainLayout, ProtectedRoute, Footer
  post/       — PostCard, PostForm, CommentList, CommentItem
  community/  — CommunityCard, CommunityBanner
  profile/    — KarmaBadge
  chat/       — Chat-specific components
  search/     — Search-specific components
```

**Rules:**
- Feature components live in their feature folder. Do not put them in `/common`.
- Truly shared, feature-agnostic components go in `/common`.
- All new Radix-based accessible primitives go in `/ui`.
- Each folder has an `index.js` barrel. Keep it updated when adding components.

---

## 2. Semantic HTML

Use the correct HTML element for every context:

| Element | Use |
|---|---|
| `<button>` | Triggers an action (no navigation) |
| `<a>` / `<Link>` | Navigation to a URL |
| `<article>` | Self-contained feed item (post card, community card) |
| `<nav>` | Navigation groups (sidebar nav, breadcrumbs) |
| `<aside>` | Sidebar content |
| `<section>` | Thematic grouping within a page |
| `<header>` | Page or section header |
| `<main>` | Primary page content |

---

## 3. No Nested Interactive Elements

**This is the most commonly broken HTML rule. Enforce it strictly.**

Never put a `<button>`, `<input>`, `<select>`, or `<a>` inside another `<a>`.

### Wrong pattern (button inside link):
```jsx
// INVALID HTML — causes accessibility and browser behavior issues
<Link to="/post/1">
  <h3>Post Title</h3>
  <button onClick={handleVote}>Vote</button>
</Link>
```

### Correct pattern (block-link with stretched ::after):
```jsx
<article className="relative">
  {/* Title link stretched to cover the card */}
  <h3>
    <Link
      to="/post/1"
      className="after:absolute after:inset-0 after:content-[''] after:rounded-xl"
    >
      Post Title
    </Link>
  </h3>

  {/* Action buttons sit above the stretched link via z-index */}
  <div className="relative z-[1] flex gap-2">
    <button onClick={handleVote}>Vote</button>
    <button onClick={handleShare}>Share</button>
  </div>
</article>
```

This pattern:
- Makes the entire card keyboard-navigable via the title link (Tab + Enter)
- Keeps action buttons independently focusable and clickable
- Requires no `e.stopPropagation()` workarounds
- Is valid HTML

---

## 4. Using `cn()` for Class Composition

Every reusable component that accepts a `className` prop must use `cn()`.

```js
// Import from the utils barrel
import { cn } from '../../utils';
// or directly
import { cn } from '../../utils/cn.js';

function Button({ variant = 'primary', className, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-primary-600 text-white hover:bg-primary-500',
        variant === 'ghost' && 'bg-transparent text-surface-300 hover:bg-surface-800',
        className // caller overrides applied last
      )}
      {...props}
    />
  );
}
```

`cn()` = `clsx()` (conditional classes) + `twMerge()` (conflict resolution).
It ensures caller overrides always win without specificity battles.

---

## 5. Lucide Icons

Use `lucide-react` for all icons. Never write inline SVG paths.

```jsx
// Correct
import { Plus, ArrowUp, MessageCircle, Share2 } from 'lucide-react';

<Plus className="w-5 h-5" aria-hidden="true" />
```

Standard sizes:
- `w-4 h-4` — small (action bar icons)
- `w-5 h-5` — standard (nav icons, button icons)
- `w-6 h-6` — large (feature icons)

Icon-only interactive elements must have:
1. `aria-label` on the wrapping `<button>` or `<Link>`.
2. `aria-hidden="true"` on the `<Icon>` component.
3. A `<Tooltip>` wrapper.

```jsx
import { Tooltip } from '../ui/tooltip.jsx';
import { Bell } from 'lucide-react';

<Tooltip content="Notifications">
  <button aria-label="View notifications">
    <Bell className="w-5 h-5" aria-hidden="true" />
  </button>
</Tooltip>
```

---

## 6. Gatherly Token Usage

Use Gatherly's semantic Tailwind tokens. See `DESIGN.md §2` for the full palette.

Quick reference for the most common tokens:

```
Backgrounds:   surface-950, surface-900, surface-850, surface-800
Borders:       surface-700, surface-200 (light)
Text:          surface-100 (primary dark), surface-400/500 (muted)
Brand:         primary-500 (interactive), primary-600 (button bg)
Error:         danger-500 (display), danger-600 (button bg)
Success:       success-500
```

**Do not use:** `gray-*`, `slate-*`, `blue-*`, `zinc-*`, `green-*`, `red-*`.

---

## 7. Accessibility Checklist

Before submitting any component, verify:

- [ ] All interactive elements reachable by Tab key
- [ ] Focus ring visible on keyboard focus (`focus-visible:ring-2 focus-visible:ring-primary-500`)
- [ ] Icon-only buttons have `aria-label`
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Dynamic content that updates (vote scores, notification counts) has `aria-live="polite"`
- [ ] Toggle buttons (join/leave, vote) have `aria-pressed`
- [ ] No nested interactive elements
- [ ] Form inputs have associated `<label>` (or `aria-label` if no visible label)
- [ ] Error messages linked to their input via `aria-describedby`

---

## 8. Responsive Behavior

Design mobile-first. Add responsive prefixes for larger screens:

```
sm:  >= 640px
md:  >= 768px
lg:  >= 1024px
xl:  >= 1280px
```

The authenticated layout:
- **Mobile:** Sidebar hidden. Content full-width.
- **Desktop:** Sidebar (w-64) | Content (flex-1) | Optional right rail.

Sidebar toggle: `hidden lg:block` on the `<aside>`.
Feed grids: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`.

Test at:
- 375px (iPhone SE, mobile)
- 768px (tablet)
- 1280px (desktop)

---

## 9. Motion / Animation

**Package:** `motion`  
**Import path:** `motion/react`  
**Never import from:** `framer-motion`

```jsx
// Correct
import { motion, AnimatePresence } from 'motion/react';

// Wrong
import { motion } from 'framer-motion';
```

**When to use Tailwind CSS animations** (prefer for simple, one-shot cases):
- Dropdown appear: `animate-fade-in-down`
- Modal appear: `animate-scale-in`
- Page content: `animate-fade-in-up`
- Skeletons: `animate-shimmer`

**When to use Motion:**
- List item insertion/removal (`AnimatePresence`)
- Layout-driven reordering
- Gesture-driven interactions (drag to dismiss)
- Staggered reveals
- Shared element transitions between routes

Animation timing: micro = 100–200ms, transitions = 250–350ms, reveals = up to 500ms.
Easing: `ease-out` for enters, `ease-in` for exits.

---

## 10. Preserving Backend Contracts

Services in `/client/src/services/` are the only layer that should call the API.

Rules:
- Do not change request URLs, HTTP methods, or body field names without confirming the server accepts the change.
- Do not duplicate service logic in components — import and use the service.
- If a feature requires a new endpoint, **report it and wait for confirmation**. Do not create a route in `/server` as part of a frontend task.

---

## 11. Task Boundary: /server is Off-Limits During Frontend Work

During any frontend task:

1. Do NOT open, read with intent to modify, or edit any file under `/server/`.
2. Do NOT modify database models, API handlers, authentication, socket logic, or server config.
3. If a UI change seems to require a backend change, stop, describe what's needed, and ask the user.
4. After completing work, run `git diff --name-only` and confirm no `/server` files appear.

---

## 12. Common Patterns Reference

### Import order convention
```js
// 1. React
import { useState, useEffect } from 'react';
// 2. Router
import { Link, useNavigate } from 'react-router-dom';
// 3. Lucide icons
import { Plus, ArrowUp } from 'lucide-react';
// 4. Internal components
import { Avatar, Button } from '../common';
import { Tooltip } from '../ui/tooltip.jsx';
// 5. Services & context
import { postService } from '../../services/post.service.js';
import { AuthContext } from '../../context/AuthContext.jsx';
// 6. Utilities
import { cn, formatCount, timeAgo } from '../../utils';
```

### Adding a new page
1. Create `pages/MyPage.jsx`
2. Add route in `router.jsx` inside `<ProtectedRoute>` + `<MainLayout>` if it requires auth
3. Export from `pages/index.js`

### Adding a new feature component
1. Create `components/[feature]/MyComponent.jsx`
2. Export from `components/[feature]/index.js`
3. Import in consuming pages via `../components/[feature]/MyComponent.jsx`
