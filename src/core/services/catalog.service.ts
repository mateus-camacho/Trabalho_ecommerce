import { useApi } from "../../hooks/use-api";
import { Product } from "../models/product.model";

export interface GetProductsRequest {
  filters: {
    categories?: string[];
    brands?: string[];
    price?: [number, number];
    rating?: [number, number];
  };
  limit: number;
  offset: number;
  sort: string;
}

export function CatalogService() {
  const api = useApi();

  const getProducts = async (
    request: GetProductsRequest
  ): Promise<{
    products: Product[];
    count: number;
    maxPrice: number;
    minPrice: number;
  }> => {
    const response = await api.post<{
      products: Product[];
      count: number;
      maxPrice: number;
      minPrice: number;
    }>(`/catalog`, request);

    return response.data;
  };

  const getProduct = async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/catalog/${id}`);

    return response.data;
  };

  const getCategories = async (): Promise<string[]> => {
    console.log(process);
    const response = await api.get<string[]>(`/categories`);

    return response.data;
  };

  const getBrands = async (): Promise<string[]> => {
    const response = await api.get<string[]>(`/brands`);

    return response.data;
  };

  return {
    getProducts,
    getProduct,
    getCategories,
    getBrands,
  };
}
