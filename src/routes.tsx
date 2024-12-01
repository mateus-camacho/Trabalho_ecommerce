import { Routes, Route } from "react-router-dom";
import Layout from "./components/template/layout";
import { CartProvider } from "./contexts/cartContext";
import { AuthProvider } from "./contexts/authContext";
import Home from "./pages/home";
import Login from "./pages/login";
import Settings from "./pages/settings";
import Orders from "./pages/orders";

export function MainRoutes() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            <Route path="settings" element={<Settings />} />
            <Route path="orders" element={<Orders />} />
          </Route>
          <Route path="/login">
            <Route index element={<Login />}></Route>
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
