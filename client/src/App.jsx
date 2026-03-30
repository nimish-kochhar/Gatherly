import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx';
import ThemeProvider from './context/ThemeContext.jsx';
import SocketProvider from './context/SocketContext.jsx';
import AppRouter from './router.jsx';

/**
 * App — Root component.
 *
 * Wraps the entire app in providers (outermost → innermost):
 *   BrowserRouter → ThemeProvider → AuthProvider → SocketProvider → Routes
 *
 * Why this order:
 *   - BrowserRouter must be outside everything that uses routing
 *   - Theme is independent of auth, so it goes first
 *   - Auth is needed before sockets (socket connects when logged in)
 *   - SocketProvider is innermost because it depends on auth state
 */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <AppRouter />
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
