import { LoaderCircle, Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useEffect } from "react";
import { CatalogService } from "@/core/services/catalog.service";
import { Product } from "@/core/models/product.model";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

export default function Search() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const catalogService = CatalogService();

  const { toast } = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setOpen(debouncedSearch.length > 0);
    setLoading(debouncedSearch.length > 0);

    if (debouncedSearch.length === 0) {
      setProducts([]);
      return;
    }

    catalogService
      .searchProducts(debouncedSearch)
      .then((data) => {
        console.log(data);
        setProducts(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);

        toast({
          duration: 2000,
          variant: "destructive",
          title: "Erro ao buscar produtos",
          description:
            "Não foi possível buscar os produtos no momento. Tente novamente mais tarde.",
        });
      });
  }, [debouncedSearch]);

  return (
    <div className="w-full max-w-lg relative">
      <div className="relative">
        <span className="h-full w-5 ml-2 absolute left-0 top-0 flex items-center justify-center text-muted-foreground">
          <SearchIcon size={20} />
        </span>

        <Input
          type="search"
          placeholder="Busca..."
          className="bg-white rounded-sm pl-8 text-sm text-gray-800"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {open && (
        <div className="w-full absolute top-12 left-0 z-10">
          <ScrollArea
            id="results"
            className="h-56 flex w-full rounded-sm p-4 bg-white border border-gray-200 shadow"
          >
            {loading ? (
              <div className="w-full h-[190px] flex items-center justify-center">
                <LoaderCircle
                  size={32}
                  className="text-blue-500 animate-spin"
                />
              </div>
            ) : products.length > 0 ? (
              <ul className="w-full">
                {products.map((product) => (
                  <li key={product.id} className="w-full">
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100"
                      onClick={() => {
                        setOpen(false);
                        setSearch("");
                        setProducts([]);
                      }}
                    >
                      <span className="min-w-12 h-12 bg-gray-50">
                        <img
                          src={
                            product.images[0].hi_res ??
                            product.images[0].large ??
                            product.images[0].thumb
                          }
                          alt={product.title}
                          className="w-12 h-12 rounded-sm object-contain"
                        />
                      </span>

                      <div className="flex items-center justify-between w-full">
                        <span className="flex flex-col gap-1">
                          <span className="text-sm text-gray-800">
                            {product.title.length > 40
                              ? product.title.substring(0, 40) + "..."
                              : product.title}
                          </span>
                          <span className="text-xs text-gray-600">
                            {product.main_category}
                          </span>
                        </span>

                        <span className="text-sm text-muted-foreground">
                          R$ {product.price}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="w-full h-[190px] flex items-center justify-center">
                <span className="text-muted-foreground text-sm">
                  Nenhum produto encontrado
                </span>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
