import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import ThemeProvider from './context/ThemeContext.jsx';
import SocketProvider from './context/SocketContext.jsx';
import { TooltipProvider } from './components/ui/tooltip.jsx';
import AppRouter from './router.jsx';

/**
 * App — Root component.
 *
 * Wraps the entire app in providers (outermost → innermost):
 *   BrowserRouter → ThemeProvider → TooltipProvider → AuthProvider → SocketProvider → Routes
 *
 * Why this order:
 *   - BrowserRouter must be outside everything that uses routing
 *   - Theme is independent of auth, so it goes first
 *   - TooltipProvider must wrap all Tooltip usage (Radix requirement)
 *   - Auth is needed before sockets (socket connects when logged in)
 *   - SocketProvider is innermost because it depends on auth state
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <SocketProvider>
              <AppRouter />
            </SocketProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;

