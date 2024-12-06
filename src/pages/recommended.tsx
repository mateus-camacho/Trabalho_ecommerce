import ProductCard from "@/components/shared/productCard";
import { useAuth } from "@/contexts/authContext";
import { Product } from "@/core/models/product.model";
import { CatalogService } from "@/core/services/catalog.service";
import { useWebsocket } from "@/hooks/use-websocket";
import { useEffect, useState } from "react";

export default function Recommended() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const catalogService = CatalogService();

  useEffect(() => {
    setLoading(true);
    setProducts([]);

    catalogService.getRecommendedProducts().then((response) => {
      setProducts(response);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (products.length === 0) return;

    const websocket = useWebsocket();

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        type: string;
        productId: string;
        quantity: number;
      };

      if (data.type === "update_stock") {
        const updatedProducts = products.map((product) => {
          if (product._id === data.productId) {
            return {
              ...product,
              stock: product.stock - data.quantity,
            };
          }

          return product;
        });

        console.log(updatedProducts);
        setProducts(updatedProducts);
      }
    };
  }, [products]);

  return (
    <div className="w-full mt-6">
      <h1 className="text-2xl font-bold text-gray-600 mb-4">
        Produtos Recomendados
      </h1>
      <div className="w-full grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductCard key={index} loadingProduct={loading} />
            ))
          : products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>
    </div>
  );
}
