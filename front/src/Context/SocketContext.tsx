import { createContext, useState, useEffect } from 'react';
import {io, Socket} from 'socket.io-client';

const port = import.meta.env.VITE_REACT_PORT;
const host = import.meta.env.VITE_REACT_HOST;
const protocal = import.meta.env.VITE_REACT_PROTOCAL;

interface contextType {
    socket: Socket | null;
}
export const SocketContext = createContext<contextType>({socket: null});
export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket = io(`${protocal}://${host}:${port}`, {
            transports: ['websocket'],
            withCredentials: true,
        });
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
