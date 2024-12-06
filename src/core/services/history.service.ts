import { useApi } from "../../hooks/use-api";
import { Product } from "../models/product.model";

export function HistoryService() 
{
    const api = useApi();

    const getPurchases = async (userId: string) : Promise <{
        purchaseId: number;
        data: Date;
        valor: number;
        products: Product[];
    }[]> =>
    {
        const response = await api.get(`/history/${userId}`);
        return response.data;
    }

    return { getPurchases };
}