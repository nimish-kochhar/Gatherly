import { Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout';
import {
  Landing,
  Home,
  Explore,
  Popular,
  CommunityPage,
  CreateCommunity,
  PostPage,
  CreatePost,
  Profile,
  Chat,
  Search,
  Settings,
  Notifications,
  NotFound,
} from './pages';

/**
 * AppRouter — Defines every route in the app.
 *
 * Route structure:
 *   /            → Landing (no navbar/sidebar — it's the marketing/auth page)
 *   /home        → Home feed        ┐
 *   /explore     → Explore          │
 *   /popular     → Popular          │
 *   /c/:slug     → Community page   │  All these use MainLayout
 *   /create-community → Create      │  (Navbar + Sidebar + content)
 *   /post/:id    → Post detail      │
 *   /create      → Create post      │
 *   /profile/:username → Profile    │
 *   /chat        → Chat             │
 *   /search      → Search           │
 *   /settings    → Settings         ┘
 *   *            → 404 Not Found
 *
 * How nested routes work:
 *   <Route element={<MainLayout />}> renders the layout shell.
 *   Its child routes render inside <Outlet /> within MainLayout.
 *   So the layout stays constant while page content swaps.
 */
function AppRouter() {
  return (
    <Routes>
      {/* Landing page — standalone, no layout shell */}
      <Route path="/" element={<Landing />} />

      {/* All authenticated pages share the MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/c/:slug" element={<CommunityPage />} />
        <Route path="/create-community" element={<CreateCommunity />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/search" element={<Search />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRouter;
