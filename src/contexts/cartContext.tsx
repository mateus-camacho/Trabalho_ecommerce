import React, { createContext, useContext, useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Cart } from "../core/models/cart.model";
import { CatalogService } from "@/core/services/catalog.service";
import { CartService } from "@/core/services/cart.service";
import { useWebsocket } from "@/hooks/use-websocket";

type CartContextType = {
  cartId: string | null;
  cart: Cart[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  addToCart: (item: Cart) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);

  const catalogService = CatalogService();
  const cartService = CartService();

  useEffect(() => {
    const fetchVisitorId = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();

      setVisitorId(result.visitorId);
      setCartId(result.visitorId);
    };

    fetchVisitorId();
  }, []);

  useEffect(() => {
    if (visitorId) fetchCart();
  }, [visitorId]);

  useEffect(() => {
    const websocket = useWebsocket();

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        type: string;
        productId: string;
        quantity: number;
      };

      if (data.type === "update_stock") {
        const updatedCart = cart.map((item) => {
          if (item.id === data.productId) {
            return {
              ...item,
              stock_quantity: item.stock_quantity - data.quantity,
            };
          }
          return item;
        });

        updatedCart.forEach((item) => {
          if (item.quantity > item.stock_quantity) {
            removeFromCart(item.id);
          }
        });

        setCart(updatedCart);
      }
    };
  }, []);

  const addToCart = (item: Cart) => {
    const existingItem = cart.find((i) => i.id === item.id);
    const product = cart.find((i) => i.id === item.id);

    if (product && product.stock_quantity <= 0) return;
    if (product && product.quantity + 1 > product.stock_quantity) return;

    setLoading(true);

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
        setLoading(false);
      });
  };

  const removeFromCart = (id: string) => {
    const existingItem = cart.find((i) => i.id === id);

    setLoading(true);

    if (existingItem) {
      setCart((prevCart) => prevCart.filter((i) => i.id !== id));
      cartService.removeFromCart(visitorId!, id).then(() => {
        console.log("Item removed from cart");
        setLoading(false);
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    cartService.clearCart(visitorId!);
  };

  const fetchCart = async () => {
    setLoading(true);

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
        stock_quantity: product!.stock,
      } as Cart;
    });

    setLoading(false);
    setCart(userCart);
  };

  return (
    <CartContext.Provider
      value={{
        cartId,
        cart,
        loading,
        setLoading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
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
