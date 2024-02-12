import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RoomsPage from './components/RoomsPage';
import AuctionRoom from './components/AuctionRoom';

let router = createBrowserRouter([
    {
        path: "/",
        element: <RoomsPage />
    },
    {
        path: "/auctions/:auctionId",
        element: <AuctionRoom />
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
