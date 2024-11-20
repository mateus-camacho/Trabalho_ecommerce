import { useApi } from "../../hooks/use-api";
import { CartItem } from "../models/cart.model";

export function CartService() {
  const api = useApi();

  const getCart = async (userId: string): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>(`/cart/${userId}`);
    return response.data;
  };

  const addToCart = async (userId: string, item: CartItem): Promise<void> => {
    await api.post(`/cart/${userId}`, {
      productId: item.id,
      quantity: item.quantity,
    });
  };

  const removeFromCart = async (
    userId: string,
    itemId: string
  ): Promise<void> => {
    await api.delete(`/cart/${userId}/${itemId}`);
  };

  const clearCart = async (userId: string): Promise<void> => {
    await api.delete(`/cart/${userId}/clear`);
  };

  return {
    getCart,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
