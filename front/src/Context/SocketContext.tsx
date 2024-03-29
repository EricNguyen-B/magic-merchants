import { createContext, useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import {io, Socket} from 'socket.io-client';
import * as ENV from '../Components/utils/Environment';

interface contextType {
    socket: Socket | null;
}
export const SocketContext = createContext<contextType>({socket: null});
export const SocketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    let [cookies] = useCookies(['logged_in', 'token']);
    useEffect(() => {
        const newSocket = io(`${ENV.getServerURL()}/`, {
            transports: ['websocket'],
            withCredentials: true,
            extraHeaders : {
                "auth_token": cookies.token
            }
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
