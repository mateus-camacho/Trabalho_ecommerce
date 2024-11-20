import React, { createContext, useContext, useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Cart } from "../core/models/cart.model";
import { Product } from "@/core/models/product.model";
import { CatalogService } from "@/core/services/catalog.service";
import { CartService } from "@/core/services/cart.service";

type CartContextType = {
  cart: Cart[];
  addToCart: (item: Cart) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart[]>([]);

  const catalogService = CatalogService();
  const cartService = CartService();

  useEffect(() => {
    const fetchVisitorId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      setVisitorId(result.visitorId);
    };

    fetchVisitorId();
  }, []);

  useEffect(() => {
    if (visitorId) fetchCart();
  }, [visitorId]);

  const addToCart = (item: Cart) => {
    const existingItem = cart.find((i) => i.id === item.id);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }

    cartService
      .addToCart(visitorId!, {
        id: item.id,
        quantity: 1,
      })
      .then(() => {
        console.log("Item added to cart");
      });
  };

  const removeFromCart = (id: string) => {
    const existingItem = cart.find((i) => i.id === id);

    if (existingItem) {
      setCart((prevCart) => prevCart.filter((i) => i.id !== id));
      cartService.removeFromCart(visitorId!, id);
    }
  };

  const clearCart = () => {
    setCart([]);
    cartService.clearCart(visitorId!);
  };

  const fetchCart = async () => {
    const products = await catalogService.getProducts({
      filters: {},
      limit: 10000,
      offset: 0,
      sort: "default",
    });

    const cart = await cartService.getCart(visitorId!);

    const userCart: Cart[] = cart.map((cartItem) => {
      const product = products.products.find((p) => p._id === cartItem.id);

      return {
        id: cartItem.id,
        name: product!.title,
        brand: product!.details.Manufacturer
          ? product!.details.Manufacturer
          : "N/A",
        image_url: product!.images.length > 0 ? product!.images[0] : "",
        price: product!.price,
        quantity: cartItem.quantity,
        stock_quantity: 100,
      } as Cart;
    });

    setCart(userCart);
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart: () => CartContextType = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
