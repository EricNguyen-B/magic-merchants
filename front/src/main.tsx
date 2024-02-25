import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SocketProvider } from "./Context/SocketContext";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material/styles'; // Use createTheme
import HomePage from "./components/pages/HomePage";
import RoomsPage from "./Components/pages/RoomsPage";
import AuctionRoom from './Components/AuctionRoom';

const themeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#bc1f39'
        },
        secondary: {
            main: '#d28f85'
        },
        background: {
            default: '#121212', // A dark background for the main content
            paper: '#1e1e1e', // A slightly lighter color for components like Sidebar
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
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <SocketProvider>
            <RouterProvider router={router} />
        </SocketProvider>
    </React.StrictMode>
);
