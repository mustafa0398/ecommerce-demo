import "./index.css";              
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./routes/Home";
import ProductsPage from "./routes/Products";
import Cart from "./routes/Cart";
import Checkout from "./routes/Checkout";
import AdminProducts from "./routes/AdminProducts";
import RequireAdmin from "./components/RequireAdmin";
import Orders from "./routes/Orders";
import AdminDashboard from "./routes/AdminDashboard";


const router = createBrowserRouter([
  { path: "/", element: <App />, children: [
    { index: true, element: <Home /> },
    { path: "products", element: <ProductsPage /> },
    { path: "cart", element: <Cart /> },
    { path: "checkout", element: <Checkout /> },
    { path: "orders", element: <Orders /> },
    { path: "admin/products", element: <RequireAdmin><AdminProducts /></RequireAdmin> },
    { path: "admin", element: <RequireAdmin><AdminDashboard /></RequireAdmin> },
  ]},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><RouterProvider router={router} /></React.StrictMode>
);
