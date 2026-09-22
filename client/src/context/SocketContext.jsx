import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext.jsx';

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

let globalSocket = null;

export default function SocketProvider({ children }) {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      if (!globalSocket) {
        globalSocket = io('/chat', {
          auth: { token: accessToken },
        });

        globalSocket.on('connect', () => {
          console.log('[SocketContext] Connected to chat namespace');
        });

        globalSocket.on('error', (err) => {
          console.error('[SocketContext] Error:', err);
        });
      }
      setSocket(globalSocket);
    } else if (!isAuthenticated && globalSocket) {
      // Clean up the socket when the user logs out
      globalSocket.disconnect();
      globalSocket = null;
      setSocket(null);
    }

    // Do NOT disconnect on normal unmount to avoid Strict Mode connect/disconnect thrashing.
    // The socket will be disconnected when isAuthenticated becomes false.
  }, [isAuthenticated, accessToken]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
