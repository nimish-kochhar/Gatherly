import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext.jsx';

export const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let newSocket = null;

    if (isAuthenticated && accessToken) {
      newSocket = io('/chat', {
        auth: { token: accessToken },
      });

      newSocket.on('connect', () => {
        console.log('[SocketContext] Connected to chat namespace');
      });

      newSocket.on('error', (err) => {
        console.error('[SocketContext] Error:', err);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, accessToken]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
