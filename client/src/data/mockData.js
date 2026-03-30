/**
 * Mock Data — Placeholder data used across the app until the API is ready.
 *
 * All mock data lives here so it's easy to find and remove later.
 * Each page imports only what it needs from this file.
 *
 * When the backend is ready:
 *   1. Delete this file
 *   2. Replace imports with API calls in each page/component
 *   3. Components already accept data via props, so they won't change
 */

// ── Current user ──
export const MOCK_USER = {
  id: 1,
  username: 'demouser',
  email: 'demo@example.com',
  avatar: null,
  bio: 'Full-stack developer passionate about building communities. Love coffee ☕ and open source.',
  createdAt: '2024-01-15T10:00:00Z',
};

// ── Communities ──
export const MOCK_COMMUNITIES = [
  {
    id: 1, name: 'ReactJS', slug: 'reactjs',
    description: 'A community for React developers to share tips, projects, and best practices.',
    memberCount: 12500, postCount: 3420, createdAt: '2023-06-01',
    banner: null, icon: null,
  },
  {
    id: 2, name: 'JavaScript', slug: 'javascript',
    description: 'Everything JavaScript — from vanilla to frameworks, from beginners to experts.',
    memberCount: 45000, postCount: 12800, createdAt: '2023-01-15',
    banner: null, icon: null,
  },
  {
    id: 3, name: 'Web Development', slug: 'webdev',
    description: 'Frontend, backend, full-stack — share your web development journey here.',
    memberCount: 28000, postCount: 8900, createdAt: '2023-03-20',
    banner: null, icon: null,
  },
  {
    id: 4, name: 'Design', slug: 'design',
    description: 'UI/UX design, graphic design, and everything visual. Share your creations!',
    memberCount: 9200, postCount: 2100, createdAt: '2023-08-10',
    banner: null, icon: null,
  },
  {
    id: 5, name: 'Gaming', slug: 'gaming',
    description: 'PC, console, mobile — discuss your favorite games and share clips.',
    memberCount: 67000, postCount: 21000, createdAt: '2023-02-01',
    banner: null, icon: null,
  },
  {
    id: 6, name: 'Photography', slug: 'photography',
    description: 'Share your best shots, learn techniques, and discuss gear.',
    memberCount: 15800, postCount: 4600, createdAt: '2023-05-12',
    banner: null, icon: null,
  },
];

// ── Posts ──
export const MOCK_POSTS = [
  {
    id: 1,
    title: 'Just shipped my first React 19 project — here are 5 things I learned',
    content: 'After months of experimenting with the new React 19 features, I finally shipped a production app. Here are the biggest takeaways from my experience...\n\n1. **Server Components are a game-changer** — they completely changed how I think about data fetching.\n2. **The new `use` hook** simplifies async patterns significantly.\n3. **Actions** make form handling feel native and clean.\n4. **Improved error boundaries** caught issues I would have missed.\n5. **The transition API** makes UX feel smoother without extra effort.',
    author: { id: 2, username: 'sarahdev', avatar: null },
    community: { id: 1, name: 'ReactJS', slug: 'reactjs' },
    upvotes: 234, downvotes: 12, commentCount: 45,
    createdAt: '2026-03-26T18:30:00Z',
    image: null,
  },
  {
    id: 2,
    title: 'Why I switched from TypeScript back to JavaScript (and why you might too)',
    content: 'Hot take incoming! After 3 years of TypeScript, I went back to plain JS for my latest project. Here\'s why the trade-offs didn\'t work for me anymore...\n\nThe type gymnastics for complex generics were taking more time than the bugs they prevented. For solo projects and small teams, the overhead isn\'t always worth it.',
    author: { id: 3, username: 'coderebel', avatar: null },
    community: { id: 2, name: 'JavaScript', slug: 'javascript' },
    upvotes: 567, downvotes: 189, commentCount: 312,
    createdAt: '2026-03-26T15:00:00Z',
    image: null,
  },
  {
    id: 3,
    title: 'Check out this glassmorphism dashboard I designed 🎨',
    content: 'Spent the weekend creating a modern dashboard design with glassmorphism effects. Used Figma for the mockups and then implemented it with CSS backdrop-filter.\n\nThe key is using subtle transparency and blur — too much and it becomes unreadable, too little and the effect is lost.',
    author: { id: 4, username: 'pixelperfect', avatar: null },
    community: { id: 4, name: 'Design', slug: 'design' },
    upvotes: 892, downvotes: 23, commentCount: 67,
    createdAt: '2026-03-26T12:00:00Z',
    image: null,
  },
  {
    id: 4,
    title: 'The complete guide to CSS Container Queries — with examples',
    content: 'Container queries are finally here and they\'re even better than I expected. This guide covers everything from basic syntax to complex responsive patterns.\n\nUnlike media queries that respond to the viewport, container queries respond to the parent container\'s size. This makes components truly self-contained and reusable.',
    author: { id: 5, username: 'cssmaster', avatar: null },
    community: { id: 3, name: 'Web Development', slug: 'webdev' },
    upvotes: 445, downvotes: 8, commentCount: 89,
    createdAt: '2026-03-25T20:00:00Z',
    image: null,
  },
  {
    id: 5,
    title: 'Elden Ring DLC — 200 hours in and I found a secret boss nobody has documented yet',
    content: 'I can\'t believe this boss exists. Hidden behind a series of illusory walls in an area most people skip entirely.\n\nThe fight itself is brutally difficult but incredibly fair. The lore implications are MASSIVE — it completely recontextualizes the ending.',
    author: { id: 6, username: 'bossslayer', avatar: null },
    community: { id: 5, name: 'Gaming', slug: 'gaming' },
    upvotes: 1230, downvotes: 45, commentCount: 234,
    createdAt: '2026-03-25T16:30:00Z',
    image: null,
  },
  {
    id: 6,
    title: 'Shot this on a $300 camera — proves gear doesn\'t matter as much as you think',
    content: 'Everyone obsesses over the latest full-frame mirrorless cameras, but this shot was taken on an entry-level APS-C with a kit lens.\n\nComposition, lighting, and timing matter infinitely more than megapixels. Stop waiting for better gear and start shooting.',
    author: { id: 7, username: 'streetshooter', avatar: null },
    community: { id: 6, name: 'Photography', slug: 'photography' },
    upvotes: 678, downvotes: 34, commentCount: 56,
    createdAt: '2026-03-25T10:00:00Z',
    image: null,
  },
];

// ── Comments ──
export const MOCK_COMMENTS = [
  {
    id: 1, postId: 1,
    content: 'Great writeup! Server Components really do change the mental model completely. I especially love how you can colocate data fetching with UI.',
    author: { id: 8, username: 'reactfan', avatar: null },
    upvotes: 45, createdAt: '2026-03-26T19:00:00Z',
    replies: [
      {
        id: 2, postId: 1, parentId: 1,
        content: 'Agreed! Once you get used to them, going back to client-side fetching feels wrong.',
        author: { id: 2, username: 'sarahdev', avatar: null },
        upvotes: 12, createdAt: '2026-03-26T19:30:00Z',
        replies: [],
      },
    ],
  },
  {
    id: 3, postId: 1,
    content: 'Point #3 about Actions is underrated. Form handling in React was always painful before this.',
    author: { id: 9, username: 'formwizard', avatar: null },
    upvotes: 28, createdAt: '2026-03-26T20:00:00Z',
    replies: [],
  },
  {
    id: 4, postId: 2,
    content: 'I respectfully disagree. TypeScript has saved me from countless runtime errors in production. The initial setup cost pays for itself quickly.',
    author: { id: 10, username: 'typesafety', avatar: null },
    upvotes: 89, createdAt: '2026-03-26T16:00:00Z',
    replies: [
      {
        id: 5, postId: 2, parentId: 4,
        content: 'It depends on the project size. For enterprise apps, TS is non-negotiable. For prototypes and small tools, JS can be faster.',
        author: { id: 3, username: 'coderebel', avatar: null },
        upvotes: 34, createdAt: '2026-03-26T16:30:00Z',
        replies: [],
      },
    ],
  },
];

// ── Helper: relative time ──
export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

// ── Helper: format large numbers ──
export function formatCount(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}
