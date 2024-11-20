import { Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { useState, useEffect } from "react";

export default function Search() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length === 0) {
      setProducts([]);
      return;
    }

    console.log("searching for", search);
  }, [search]);

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

      {products.length > 0 && (
        <div className="w-full absolute top-12 left-0 z-10">
          <ScrollArea className="h-56 w-full rounded-sm p-4 bg-white border border-gray-200 shadow"></ScrollArea>
        </div>
      )}
    </div>
  );
}
