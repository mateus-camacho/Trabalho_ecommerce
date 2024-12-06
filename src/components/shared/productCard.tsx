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
import { LoaderCircle } from "lucide-react";
import { Product } from "@/core/models/product.model";

export interface ProductProps {
  product?: Product;
  loadingProduct?: boolean;
}

export default function ProductCard({ product, loadingProduct }: ProductProps) {
  const { cart, addToCart, loading } = useCart();

  const handleAddToCart = () => {
    const item: Cart = {
      id: product!._id,
      name: product!.title,
      price: product!.price,
      image_url: product!.images.length
        ? product!.images[0].hi_res ??
          product!.images[0].large ??
          product!.images[0].thumb
        : "",
      brand: product!.details.Manufacturer
        ? product!.details.Manufacturer
        : "N/A",
      stock_quantity: product!.stock,
      quantity: 1,
    };

    if (product!.stock <= 0) return;

    addToCart(item);
  };

  return (
    // <Link
    //   // to={`/product/${product?._id}`}
    //   to={`/`}
    //   style={{ pointerEvents: loadingProduct ? "none" : "auto" }}
    //   className="w-full"
    // >
    <Card className="w-full max-w-72 h-full hover:shadow-xl rounded-md transition duration-300 ease-in-out">
      <CardHeader>
        {loadingProduct ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <div className="h-40 w-full overflow-hidden">
            <img
              src={
                product?.images.length
                  ? product?.images[0].hi_res ??
                    product?.images[0].large ??
                    product?.images[0].thumb
                  : ""
              }
              alt={product?.title}
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 h-auto">
        <CardTitle className="text-gray-800 font-bold mb-2 h-12">
          {loadingProduct ? (
            <Skeleton className="h-6 w-2/3" />
          ) : product!.title.length > 55 ? (
            product?.title.slice(0, 55) + "..."
          ) : (
            product?.title
          )}
        </CardTitle>
        <CardDescription className="text-gray-500 text-justify h-16">
          {loadingProduct ? (
            <Skeleton className="h-4 w-1/2" />
          ) : product!.description.length > 0 ? (
            product!.description[0].length > 80 ? (
              product?.description[0].slice(0, 80) + "..."
            ) : (
              product?.description[0]
            )
          ) : (
            "Sem descrição"
          )}
        </CardDescription>
        <div className="flex flex-col gap-1 mt-3 h-12">
          <div className="flex items-center justify-between mb-0 mt-auto">
            {loadingProduct ? (
              <>
                <Skeleton className="h-6 w-1/4 ml-auto" />
              </>
            ) : (
              <>
                <span
                  className="font-semibold text-sm ml-auto"
                  style={{
                    color:
                      product!.stock > 0 ? "rgb(22 163 74)" : "rgb(220 38 38)",
                  }}
                >
                  {product!.stock > 0
                    ? `em estoque (${product?.stock})`
                    : "sem estoque"}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center justify-between mb-0 mt-auto">
            {loadingProduct ? (
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
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        {loadingProduct ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <Button
            size={"sm"}
            variant="default"
            className="w-full"
            onClick={handleAddToCart}
            disabled={
              product!.stock <= 0 ||
              cart.find((item) => item.id === product!._id)?.quantity! >=
                product!.stock
            }
            style={{
              pointerEvents: product!.stock > 0 && !loading ? "auto" : "none",
              textDecoration: product!.stock > 0 ? "none" : "line-through",
            }}
          >
            {product!.stock > 0 ? (
              <>
                {loading ? (
                  <LoaderCircle
                    size={16}
                    className="text-white-500 animate-spin"
                  />
                ) : (
                  <>
                    {cart.find((item) => item.id === product!._id)?.quantity! >=
                    product!.stock
                      ? "Máximo atingido"
                      : "Adicionar ao carrinho"}
                  </>
                )}
              </>
            ) : (
              "Produto sem estoque"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
    // </Link>
  );
}
