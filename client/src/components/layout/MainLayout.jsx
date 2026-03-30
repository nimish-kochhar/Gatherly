import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import Footer from './Footer.jsx';

/**
 * MainLayout — The shell that wraps all authenticated pages.
 *
 * Structure:
 *   ┌──────────────────────────────────────┐
 *   │             Navbar (sticky)          │
 *   ├───────────┬──────────────────────────┤
 *   │           │                          │
 *   │  Sidebar  │   <Outlet /> (pages)     │
 *   │  (sticky) │   + Footer               │
 *   │           │                          │
 *   └───────────┴──────────────────────────┘
 *
 * How <Outlet> works:
 *   When you define nested routes in React Router, the parent route
 *   renders <Outlet> where child route components should appear.
 *   So this layout stays constant while the page content swaps out.
 */
export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
