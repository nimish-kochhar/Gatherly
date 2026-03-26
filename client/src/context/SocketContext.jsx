// TODO: Implement SocketContext with socket.io-client
import { createContext } from 'react';

export const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  // TODO: Connect socket when user is authenticated
  // TODO: Disconnect on logout
  return <SocketContext.Provider value={{}}>{children}</SocketContext.Provider>;
}
