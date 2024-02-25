import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SocketProvider } from "./Context/SocketContext";
import { ThemeProvider, createTheme, PaletteMode } from '@mui/material';
import HomePage from "./Components/pages/HomePage";
import AuctionRoom from './Components/content/AuctionRoom';
import SellersPage from "./Components/pages/SellersPage";

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
        path: "/",
        element: <HomePage />
    },
    {
        path: "/auction-room/:auctionId",
        element: <AuctionRoom />
    },
    {
        path: "/sellers-page",
        element: <SellersPage />
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
