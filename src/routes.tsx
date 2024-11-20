import { Routes, Route } from "react-router-dom";
import Layout from "./components/template/layout";
import Home from "./pages/Home";
import { CartProvider } from "./contexts/cartContext";

export function MainRoutes() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
