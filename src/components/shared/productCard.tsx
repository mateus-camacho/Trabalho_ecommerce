import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "@/contexts/cartContext";
import { Cart } from "@/core/models/cart.model";

export interface ProductProps {
  product?: any;
  loading?: boolean;
}

export default function ProductCard({ product, loading }: ProductProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const item: Cart = {
      id: product._id,
      name: product.title,
      price: product.price,
      image_url: product.images.length ? product.images[0].hi_res : "",
      brand: product.details.Manufacturer
        ? product.details.Manufacturer
        : "N/A",
      stock_quantity: 100,
      quantity: 1,
    };

    addToCart(item);
  };

  return (
    <Link
      to={`/`}
      style={{ pointerEvents: loading ? "none" : "auto" }}
      className="w-full"
    >
      <Card className="w-full max-w-72 h-full hover:shadow-xl rounded-md transition duration-300 ease-in-out">
        <CardHeader>
          {loading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <div className="h-40 w-full overflow-hidden">
              <img
                src={product?.images.length ? product.images[0].hi_res : ""}
                alt={product?.title}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col h-40 px-4">
          <CardTitle className="text-gray-800 font-bold mb-1">
            {loading ? (
              <Skeleton className="h-6 w-2/3" />
            ) : product?.title.length > 55 ? (
              product?.title.slice(0, 55) + "..."
            ) : (
              product?.title
            )}
          </CardTitle>
          <CardDescription className="text-gray-500 text-justify mt-2">
            {loading ? (
              <Skeleton className="h-4 w-1/2" />
            ) : product.description.length > 0 ? (
              product?.description[0].length > 80 ? (
                product?.description[0].slice(0, 80) + "..."
              ) : (
                product?.description[0]
              )
            ) : (
              "Sem descrição"
            )}
          </CardDescription>
          <div className="flex items-center justify-between mb-0 mt-auto">
            {loading ? (
              <>
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-6 w-1/4" />
              </>
            ) : (
              <>
                <span className="text-gray-800 font-bold text-sm">
                  R$ {product?.price.toFixed(2)}
                </span>

                <span className="flex items-center justify-items-end gap-1">
                  <Star size={16} className="text-yellow-500" />
                  <span className="text-gray-800 font-bold">
                    {product?.average_rating}
                  </span>
                </span>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between mt-4">
          {loading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Button
              variant="default"
              className="w-full"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
