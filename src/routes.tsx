import { Routes, Route } from "react-router-dom";
import RootLayout from "./components/template/rootLayout";
import Layout from "./components/template/layout";
import { CartProvider } from "./contexts/cartContext";
import { AuthProvider } from "./contexts/authContext";

import Home from "./pages/home";
import Login from "./pages/login";
import Settings from "./pages/settings";
import Orders from "./pages/orders";
import Product from "./pages/product";
import Recommended from "./pages/recommended";

export function MainRoutes() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/recommended" element={<Recommended />} />
          </Route>
          <Route path="/login" element={<Layout />}>
            <Route index element={<Login />}></Route>
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
