import { useState, useEffect } from "react";
import { Product } from "@/core/models/product.model";
import { HistoryService } from "@/core/services/history.service";

import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import { LoaderCircle } from "lucide-react";

export default function Orders() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState<
    {
      id: number;
      data: Date;
      valor: number;
      itens: {
        quantidade: number;
        product: Product;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (!user || !user.id) return;

    const userId = user.id;

    const fetchPurchases = async () => {
      try {
        const service = HistoryService();
        const data = await service.getPurchases(userId);
        console.log(data);
        setPurchases(data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar o histórico de compras:", error);
      }
    };

    fetchPurchases();
  }, [user]);

  return (
    <div className="w-full h-full min-h-[700px] my-auto flex flex-col">
      {loading ? (
        <LoaderCircle size={60} className="text-blue-500 animate-spin m-auto" />
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-600 mb-4 mt-6">
            Histórico de Compras
          </h1>
          {purchases.length === 0 ? (
            <p className="text-gray-600">Nenhuma compra encontrada.</p>
          ) : (
            purchases.map((purchase, index) => (
              <div
                key={`purchase-${index}-${purchase.id}`}
                className="flex flex-col border border-gray-200 bg-white p-4 rounded-md shadow-sm mb-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-gray-600">
                    {new Date(purchase.data).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </h2>
                  <p className="text-gray-600">
                    Total:{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(purchase.valor)}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-2">
                  {purchase.itens.map((item) => (
                    <Link
                      key={`purchase-${index}-${item.product.id}`}
                      to={`/product/${purchase.itens[0].product.id}`}
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      <div className="w-full flex gap-4">
                        <span className="min-w-20 h-20 bg-gray-50">
                          <img
                            src={
                              item.product.images[0].hi_res ??
                              item.product.images[0].large ??
                              item.product.images[0].thumb
                            }
                            alt={item.product.title}
                            className="w-20 h-20 rounded-sm object-contain"
                          />
                        </span>

                        <div className="flex items-center justify-between w-full">
                          <span className="flex flex-col gap-1">
                            <span className="text-sm text-gray-800">
                              {item.product.title.length > 40
                                ? item.product.title.substring(0, 40) + "..."
                                : item.product.title}
                            </span>
                            <span className="text-xs text-gray-600">
                              {item.product.main_category}
                            </span>
                          </span>

                          <span className="text-sm text-muted-foreground">
                            {item.quantidade}
                            {" X "}
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(item.product.price)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
