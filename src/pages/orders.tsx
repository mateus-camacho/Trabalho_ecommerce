import { useState, useEffect } from "react";
import { Product } from "@/core/models/product.model";
import { HistoryService } from "@/core/services/history.service";

import { Link } from "react-router-dom";

export default function Orders() {
    const [purchases, setPurchases] = useState<{
        purchaseId: number;
        data: Date;
        valor: number;
        products: Product[];
    }[]>([]); 

    const userId = "123"; 

    useEffect(() => 
    {
        const fetchPurchases = async () =>
        {
            try 
            {
                const service = HistoryService();
                const data = await service.getPurchases(userId); 
                setPurchases(data); 
            } catch (error) {
                console.error("Erro ao buscar o histórico de compras:", error);
            }
        };

        fetchPurchases(); 
    }, [userId]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col w-full max-w-2xl bg-white p-8 rounded-lg shadow">
                <h1>Histórico de Compras</h1>
                {purchases.length === 0 ? (
                    <p>Nenhuma compra encontrada.</p>
                ) : (
                    <ul>
                        {purchases.map((purchase) => (
                            <li key={purchase.purchaseId}>
                                <strong>ID da Compra:</strong> {purchase.purchaseId}<br />
                                <strong>Data:</strong> {new Date(purchase.data).toLocaleDateString()}<br />
                                <strong>Valor:</strong> R$ {purchase.valor.toFixed(2)}<br />
                                <strong>Produtos:</strong>
                                <ul>
                                    {purchase.products.map((product) => (
                                        <li key={product._id}>{product.title}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}
                <Link to="/" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Voltar
                </Link>
            </div>
        </div>
    );
}
