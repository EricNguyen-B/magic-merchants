import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RoomsPage from "./Components/pages/RoomsPage";
import AuctionRoom from './Components/AuctionRoom';

let router = createBrowserRouter([
    {
        path: "/",
        element: <RoomsPage />
    },
    {
        path: "/auction-room/:auctionId",
        element: <AuctionRoom />
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
