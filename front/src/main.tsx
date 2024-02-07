import React from "react";
import ReactDOM from "react-dom/client";
import WidgetTable from "./Components/WidgetTable";
import Layout from "./Components/Layout";
import NotFound from "./Components/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

let router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <WidgetTable />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
