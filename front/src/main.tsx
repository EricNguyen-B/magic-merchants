import React, {ReactNode, useEffect} from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SocketProvider } from "./Context/SocketContext";
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import HomePage from "./Components/pages/HomePage";
import AuctionRoom from './Components/pages/AuctionRoomPage';
import SellersPage from "./Components/pages/SellersPage";
import LoginPage from "./Components/pages/LoginPage";
import RegisterPage from "./Components/pages/RegisterPage";
import Payment from "./Components/pages/PaymentPage"
import { Link, Navigate, Outlet } from "react-router-dom";
import { useCookies, CookiesProvider } from "react-cookie";

interface PrivateRouteProps {
    privateContent: ReactNode;
    publicContent: ReactNode;
}

function Layout() {
    let [cookies, setCookies] = useCookies(['logged_in']);
    useEffect(() => {
        if (cookies.logged_in === undefined){
            console.log("Cookie doesn't exists. Setting one now");
            setCookies('logged_in', false);
        }
    })
    return (
        <CookiesProvider>
            <div className="page-layout">
                <main className="main-body">
                    <Outlet />
                </main>
            </div>
        </CookiesProvider>
    );
}
const PrivateRoute:React.FC<PrivateRouteProps> = ({privateContent, publicContent}) => {
    let [cookies] = useCookies(['logged_in']);
    return (cookies.logged_in? <>{privateContent}</>: <>{publicContent}</>);
}

const themeOptions = {
    palette: {
        mode: 'dark' as PaletteMode,
        primary: {
            main: '#bc1f39'
        },
        secondary: {
            main: '#d28f85'
        },
        background: {
            default: '#121212', 
            paper: '#1e1e1e'
        },
    }
};

const theme = createTheme(themeOptions);

let router = createBrowserRouter([
    {
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <PrivateRoute privateContent={<HomePage/>} publicContent={<LoginPage/>}/>
            },
            {
                path:"/register",
                element: <RegisterPage/>
            },
            {
                path: "/auction-room",
                element: <PrivateRoute privateContent={<AuctionRoom/>} publicContent={<LoginPage/>}/>
            },
            {
                path: "/payment",
                element: <PrivateRoute privateContent={<Payment/>} publicContent={<LoginPage/>}/>
            },
            {
                path: "/sellers-page",
                element: <PrivateRoute privateContent={<SellersPage/>} publicContent={<LoginPage/>}/>
            },
            {
                path: "*",
                element: <LoginPage/>
            }
        ]
    }
    
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SocketProvider>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </SocketProvider>
    </React.StrictMode>
);
