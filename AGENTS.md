# Gatherly — Agent Directives

> Read this file before starting any task in this repository.
> These rules apply to all AI coding agents working on Gatherly.

---

## 1. Project Overview

Gatherly is a full-stack community platform (Reddit-like). Users join communities, create posts, vote, comment, and chat.

**Repository layout:**

```
/client   — React 19 frontend (Vite, Tailwind CSS, React Router v7)
/server   — Node.js + Express backend (REST API + Socket.io)
/packages — Shared code between client and server
```

---

## 2. The Hard Boundary: Frontend / Backend Split

### NEVER modify `/server` during frontend tasks.

This is a strict, unconditional rule. The following are off-limits during frontend work:

- Any file under `/server/`
- Database models and schema
- API route handlers
- Authentication logic (JWT, sessions, middleware)
- Socket.io gateways
- Server configuration (`/server/src/config/`)
- Environment variables for the server

If a UI change appears to require a backend change, **stop and report it** to the user. Do not modify the backend unilaterally.

### Equally: Do not modify the frontend during backend tasks.

---

## 3. Frontend Stack

| Concern | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Routing | React Router v7 (`react-router-dom`) |
| Styling | Tailwind CSS v3 + custom design tokens |
| State | React Context (Auth, Theme, Socket) |
| HTTP | Axios (`/services/`) |
| Real-time | Socket.io client |
| Icons | `lucide-react` |
| Animation | `motion` — import from `motion/react` |
| Class utils | `clsx` + `tailwind-merge` via `cn()` in `utils/cn.js` |
| UI primitives | Radix UI (via `/components/ui/`) |

**Before doing any UI work, read [`DESIGN.md`](./DESIGN.md).**

---

## 4. Architecture Rules

### 4.1 Component Organization

```
/client/src/
  components/
    common/       — Truly shared, feature-agnostic (Button, Avatar, Loader)
    ui/           — Radix-based accessible primitives (Dialog, Tooltip, Input, DropdownMenu)
    layout/       — App shell (Navbar, Sidebar, MainLayout, ProtectedRoute)
    post/         — Post feature components (PostCard, PostForm, CommentList, CommentItem)
    community/    — Community feature components (CommunityCard, CommunityBanner)
    profile/      — Profile feature components (KarmaBadge)
    chat/         — Chat feature components
    search/       — Search feature components
  pages/          — One file per route
  context/        — React context providers
  hooks/          — Custom React hooks
  services/       — Axios API service modules (do not modify backend contracts)
  utils/          — Pure utility functions (cn, timeAgo, formatCount, formatKarma)
  styles/         — Global CSS (index.css)
```

Do not put feature-specific components in `/common`.
Do not put truly shared components inside a feature folder.

### 4.2 Styling

- Use Tailwind utility classes.
- Use Gatherly's token set: `primary-*`, `accent-*`, `surface-*`, `success-*`, `danger-*`.
- **Never use raw Tailwind color families**: `gray-*`, `slate-*`, `blue-*`, `zinc-*`, `green-*`, `red-*`.
- Do not introduce new design tokens without updating `DESIGN.md` and `tailwind.config.js`.
- Reusable components accepting `className` must use `cn()` for class merging.

### 4.3 Semantic HTML

- Use `<button>` for actions, `<a>`/`<Link>` for navigation.
- Use `<article>` for feed items (posts, community cards).
- Use `<nav>` for navigation sections, `<aside>` for sidebars.
- **Never nest interactive elements.** No `<button>` inside `<a>`, no `<a>` inside `<a>`.
- For clickable cards, use the block-link pattern (CSS `::after` stretch on the title link; action buttons use `relative z-[1]`).

### 4.4 Accessibility

Every interactive element must:
- Be keyboard-reachable (correct Tab order).
- Have a visible focus ring (`focus-visible:ring-2 focus-visible:ring-primary-500`).
- Have an `aria-label` if icon-only.
- Not nest other interactive elements.

### 4.5 Icons

Use `lucide-react` for all icons. Do not write inline SVG paths.
Wrap icon-only buttons with `<Tooltip>` from `components/ui/tooltip.jsx`.

### 4.6 Animation

Use `motion/react` (from the `motion` package). **Never import from `framer-motion`.**

---

## 5. Before Making UI Changes

1. **Read `DESIGN.md`** — understand the color tokens, typography, and component conventions.
2. **Check existing components** — the component may already exist in `/common` or `/ui`.
3. **Search for stale imports** — when moving or renaming components, run `grep` across `/src` to find all consumers before deleting anything.
4. **Verify responsive behavior** — test at mobile (375px), tablet (768px), and desktop (1280px) after changes.
5. **Do not redesign for aesthetic reasons** without explicit user approval. Refactoring (structure, accessibility, semantics) is fine. Visual redesign is a separate step.

---

## 6. Running the Frontend

```bash
# From the /client directory:
npm run dev       # Start Vite dev server (http://localhost:5173)
npm run build     # Production build
npm run preview   # Preview the production build
```

The dev server proxies `/api` and `/socket.io` to `http://localhost:5000`.
The backend must be running separately for API calls to work.

---

## 7. Validation After Changes

After any set of component changes, verify:

1. `npm run build` from `/client` succeeds with no errors.
2. No stale import paths remain (run grep for deleted/moved files).
3. No `/server` files have been modified (`git diff --name-only` should show only `/client` or root-level files).
4. UI renders correctly at mobile and desktop widths.

---

## 8. API Contracts

Services in `/client/src/services/` are the only layer that calls the backend API.
Do not:
- Change the request shape (URL, method, body fields) without confirming the API accepts it.
- Add new API calls without confirming the endpoint exists in the server.
- Duplicate service logic inside components — use the existing service modules.

---

## 9. Git Policy

- Do not commit work in progress unless explicitly asked.
- Do not stage or commit files under `/server` during frontend tasks.
- Report `git status` output after completing a task.
