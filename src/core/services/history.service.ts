import { useApi } from "../../hooks/use-api";
import { Product } from "../models/product.model";

export function HistoryService() {
  const api = useApi();

  const getPurchases = async (
    userId: string
  ): Promise<
    {
      id: number;
      data: Date;
      valor: number;
      itens: {
        quantidade: number;
        product: Product;
      }[];
    }[]
  > => {
    const response = await api.get(`/history/${userId}`);
    return response.data;
  };

  return { getPurchases };
}
