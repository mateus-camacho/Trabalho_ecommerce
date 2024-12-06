import { useState, useEffect } from "react";
import ProductCard from "@/components/shared/productCard";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Product } from "@/core/models/product.model";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Trash,
} from "lucide-react";

import CheckboxGroup from "@/components/shared/checkbox-group";
import DualRangeInput from "@/components/shared/dual-range-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CatalogService } from "@/core/services/catalog.service";
import { useCart } from "@/contexts/cartContext";

import { useWebsocket } from "@/hooks/use-websocket";

const filterSchema = z.object({
  categories: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  price: z.tuple([z.number(), z.number()]),
  rating: z.tuple([z.number(), z.number()]),
});

function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingBrands, setLoadingBrands] = useState(true);

  const [filters, setFilters] = useState({});
  const [maxPrice, setMaxPrice] = useState<number>(100);

  const [isFiltering, setIsFiltering] = useState(false);
  const [sort, setSort] = useState<string>("default");
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<string>("10");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const catalogService = CatalogService();

  const { cart } = useCart();

  const filterForm = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      categories: [],
      brands: [],
      price: [0, 100],
      rating: [0, 5],
    },
  });

  const { handleSubmit, reset } = filterForm;

  const handleClearFilter = () => {
    reset();
    setIsFiltering(false);
    setFilters({});
  };

  const handleFilter = () => {
    const values = filterForm.getValues();
    setFilters({
      categories: values.categories,
      brands: values.brands,
      price: values.price,
      rating: values.rating,
    });
    setIsFiltering(true);
  };

  useEffect(() => {
    catalogService.getCategories().then((response) => {
      setCategories(response);
      setLoadingCategories(false);
    });

    catalogService.getBrands().then((response) => {
      setBrands(response);
      setLoadingBrands(false);
    });
  }, []);

  useEffect(() => {
    setLoading(true);

    catalogService
      .getProducts({
        filters,
        limit: parseInt(limit),
        offset: page * parseInt(limit),
        sort,
      })
      .then((response) => {
        const { products, count, maxPrice } = response;

        setTotalProducts(count);
        setTotalPages(count > 0 ? Math.ceil(count / parseInt(limit)) : 0);
        setProducts(products);
        setMaxPrice(maxPrice);
        filterForm.setValue("price", [0, maxPrice]);

        setLoading(false);
      });
  }, [filters, limit, page, sort]);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

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
    <div className="w-full flex flex-col gap-4 mt-4 ">
      <div className="w-full flex items-center justify-end gap-2">
        <div className="w-max flex items-center justify-center gap-1">
          <Label className="text-gray-600">Ordernar por:</Label>
          <Select value={sort} onValueChange={(value) => setSort(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Padrão</SelectItem>
              <SelectItem value="price-asc">Preço: Baixo para Alto</SelectItem>
              <SelectItem value="price-desc">Preço: Alto para Baixo</SelectItem>
              <SelectItem value="rating-asc">
                Avaliação: Baixo para Alto
              </SelectItem>
              <SelectItem value="rating-desc">
                Avaliação: Alto para Baixo
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-max flex items-center justify-center gap-1">
          <Label className="text-gray-600">Mostrar:</Label>
          <Select value={limit} onValueChange={(value) => setLimit(value)}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full h-full flex gap-4">
        <aside className="w-full max-w-xs h-min">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-600 ml-2">Filtrar</h2>

            {isFiltering && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:text-red-500"
                onClick={() => handleClearFilter()}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>

          <Separator className="mt-2 mb-4" />

          <Form {...filterForm}>
            <form
              onSubmit={handleSubmit(handleFilter)}
              className="flex flex-col gap-2 mt-2"
            >
              <CheckboxGroup
                form={filterForm}
                name="categories"
                label="Categorias"
                values={categories.map((category) => ({
                  value: category,
                  label: category,
                }))}
                loading={loadingCategories}
              />

              <CheckboxGroup
                form={filterForm}
                name="brands"
                label="Marcas"
                values={brands.map((brand) => ({
                  value: brand,
                  label: brand,
                }))}
                loading={loadingBrands}
              />

              <DualRangeInput
                form={filterForm}
                name="price"
                label="Preço"
                min={0}
                max={maxPrice}
                loading={loading}
                customLabel="R$ "
              />

              <DualRangeInput
                form={filterForm}
                name="rating"
                label="Avaliação"
                min={0}
                max={5}
                loading={loading}
                customLabel={<Star size={16} className="text-yellow-500" />}
              />

              <Button className="mt-4" onClick={() => handleFilter()}>
                Filtrar
              </Button>
            </form>
          </Form>
        </aside>
        <div className="w-full flex-initial flex flex-col gap-2">
          <div className="grid place-items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <ProductCard key={index} loadingProduct={loading} />
                ))
              : products.map((product, index) => (
                  <ProductCard key={index} product={product} />
                ))}
          </div>

          <div className="w-full flex items-center justify-between px-2">
            <p className="text-gray-600 text-sm">
              {totalProducts} {totalProducts > 1 ? "produtos" : "produto"}{" "}
              encontrado{totalProducts > 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 0 || loading}
                onClick={() => setPage(0)}
              >
                <ChevronsLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page === 0 || loading}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={20} />
              </Button>

              <p className="text-gray-600 mx-2">
                {page + 1} de {totalPages}
              </p>

              <Button
                variant="outline"
                size="icon"
                disabled={page + 1 === totalPages || loading}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={page + 1 === totalPages || loading}
                onClick={() => setPage(totalPages - 1)}
              >
                <ChevronsRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
