import { Product as ProductModel } from "@/core/models/product.model";
import { CatalogService } from "@/core/services/catalog.service";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useCart } from "@/contexts/cartContext";
import { Cart } from "@/core/models/cart.model";
import { LoaderCircle } from "lucide-react";
import { useWebsocket } from "@/hooks/use-websocket";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductModel | undefined>();
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  const catalogService = CatalogService();

  const { cart, addToCart, loading } = useCart();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    catalogService
      .getProduct(id)
      .then((product) => {
        console.log(product);
        setProduct(product);
        setLoadingProduct(false);
      })
      .catch((error) => {
        console.error(error);
        navigate("/");
      });
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const websocket = useWebsocket();

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data) as {
        type: string;
        productId: string;
        quantity: number;
      };

      if (data.type === "update_stock" && product._id === data.productId) {
        const updatedProduct = {
          ...product,
          stock: product.stock - data.quantity,
        };
        setProduct(updatedProduct);
      }
    };
  }, [product]);

  const handleAddToCart = () => {
    const item: Cart = {
      id: product!._id,
      name: product!.title,
      price: product!.price,
      image_url: product!.images.length ? product!.images[0].hi_res : "",
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
    <div className="min-h-full py-8 flex flex-col w-full">
      {loadingProduct ? (
        <Skeleton className="h-6 w-96" />
      ) : (
        <div className="flex items-center gap-2 font-medium">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link
                  to="/"
                  className="transition-all duration-300 hover:underline"
                >
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link
                  to={`/products/${id}`}
                  className="flex items-center gap-2"
                >
                  <p className="text-blue-500 text-sm font-normal">
                    {product
                      ? product.title.length > 25
                        ? product.title.slice(0, 25) + "..."
                        : product.title
                      : "Produto"}
                    #{product?.id}
                  </p>
                </Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-600 mb-6 mt-4">
        {loadingProduct ? <Skeleton className="h-8 w-96" /> : product?.title}
      </h1>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-x-10 px-4">
        {loadingProduct ? (
          <Skeleton className="h-96 w-full xl:col-span-2" />
        ) : (
          <div className="h-min bg-white rounded-lg border border-gray-100 shadow xl:col-span-2 p-8 flex flex-col-reverse lg:flex-row gap-8">
            <div className="w-full lg:w-20 h-full flex lg:flex-col gap-2">
              {product?.images.map((image, index) => (
                <button
                  className={
                    "w-20 h-20 p-2 border rounded-lg hover:border-blue-500 transition-colors duration-300 " +
                    (imageIndex === index
                      ? "border-blue-500"
                      : "border-gray-100")
                  }
                  key={index}
                  onClick={() => setImageIndex(index)}
                >
                  <img
                    src={image.hi_res}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
            <div className="w-full">
              <div className="max-w-xl h-full aspect-square mx-auto">
                <img
                  src={product?.images[imageIndex].hi_res}
                  alt={product?.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {loadingProduct ? (
          <Skeleton className="h-96 w-full" />
        ) : (
          <div className="w-full h-min bg-white rounded-lg border border-gray-100 shadow p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2 font-gray-500 font-medium text-sm">
              <p
                className="font-semibold text-sm ml-auto"
                style={{
                  color:
                    product!.stock > 0 ? "rgb(22 163 74)" : "rgb(220 38 38)",
                }}
              >
                {product!.stock > 0
                  ? `em estoque (${product?.stock})`
                  : "sem estoque"}
              </p>

              <h2 className="text-2xl font-extrabold text-blue-600">
                {product?.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }) || "R$ 0,00"}
              </h2>

              <p>
                loja: <span className="font-bold">{product?.store}</span>
              </p>

              <p>
                categoria:{" "}
                <span className="font-bold">{product?.main_category}</span>
              </p>

              <div className="mt-2">
                <p>outras categorias: </p>
                <div className="w-full flex flex-wrap mt-2">
                  {product?.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs mr-2"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <p>avaliação: </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={
                        (product?.average_rating &&
                        index < Math.floor(product?.average_rating)
                          ? "text-yellow-500"
                          : "text-gray-300") + " transition-colors duration-300"
                      }
                    />
                  ))}

                  <span className="font-normal">
                    ({product?.average_rating}) {product?.rating_number}{" "}
                    avaliações
                  </span>
                </div>
              </div>
            </div>

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
                      {cart.find((item) => item.id === product!._id)
                        ?.quantity! >= product!.stock
                        ? "Máximo atingido"
                        : "Adicionar ao carrinho"}
                    </>
                  )}
                </>
              ) : (
                "Produto sem estoque"
              )}
            </Button>
          </div>
        )}

        {!loadingProduct && (
          <div className="w-full col-span-3 bg-white rounded-lg border border-gray-100 shadow p-6">
            <h2 className="text-xl font-bold text-gray-600 mb-4">
              Especificações
            </h2>

            <div className="w-full flex items-start gap-6">
              <div className="text-sm font-medium text-gray-600 w-full">
                {product && product?.description.length > 0 ? (
                  product?.description.map((description, index) => (
                    <p key={index} className="text-justify mb-1">
                      {description}
                    </p>
                  ))
                ) : (
                  <p>Sem descrição</p>
                )}
              </div>

              <div className="w-full bg-gray-50 border border-gray-100 p-4">
                <h3 className="text-lg font-bold text-gray-600 mb-4">
                  Detalhes do produto
                </h3>
                <Table>
                  <TableBody>
                    {product &&
                      Object.entries(metadataKeys).map(
                        ([key, value], index) => (
                          <TableRow key={index}>
                            <TableCell>{value}</TableCell>
                            <TableCell>
                              {key !== "details"
                                ? Array.isArray(
                                    product[key as keyof ProductModel]
                                  )
                                  ? product[key as keyof ProductModel].map(
                                      (item: any, index: any) => (
                                        <span key={index} className="block">
                                          {item}
                                        </span>
                                      )
                                    )
                                  : product[key as keyof ProductModel] || "N/A"
                                : Object.entries(metadataKeysDetails).map(
                                    ([key, value], index) => (
                                      <div key={index}>
                                        <span className="font-semibold">
                                          {value}:{" "}
                                        </span>
                                        <span>
                                          {(product.details as any)[
                                            key as any
                                          ] || "N/A"}
                                        </span>
                                      </div>
                                    )
                                  )}
                            </TableCell>
                          </TableRow>
                        )
                      )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const metadataKeys = {
  features: "Características",
  details: "Detalhes",
  parent_asin: "ASIN",
  bought_together: "Comprado junto",
};

const metadataKeysDetails = {
  Pricing: "Preço",
  "Product Dimensions": "Dimensões do produto",
  "Type of item": "Tipo de item",
  Rated: "Classificação",
  "Item model number": "Número do modelo",
  "Is Discontinued By Manufacturer": "Descontinuado pelo fabricante",
  "Item Weight": "Peso do item",
  Manufacturer: "Fabricante",
  "Date First Available": "Data de lançamento",
};
