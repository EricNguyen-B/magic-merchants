import { createContext, useState, useEffect } from 'react';
import {io, Socket} from 'socket.io-client';

interface contextType {
    socket: Socket | null;
}
export const SocketContext = createContext<contextType>({socket: null});
export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
    
        return () => {
            newSocket.close();
        };
    }, []);
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
  };
