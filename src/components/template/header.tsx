import Search from "./search";
import Cart from "./cart";
import Avatar from "./avatar";
import { Menu } from "./menu";

export default function Header() {
  return (
    <header className="w-full bg-[#232f3e] shadow">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center">
        <div className="w-full grid grid-cols-6 gap-1 items-center py-2">
          <div className="w-full col-span-4 col-start-2">
            <h1 className="text-white text-2xl font-bold text-center mb-2">
              Minha Loja
            </h1>

            <div className="w-full flex items-center justify-center mx-auto">
              <Search />
            </div>
          </div>

          <div className="w-full h-full flex items-end justify-end gap-4 text-white col-span-1">
            <Avatar />
            <Cart />
          </div>
        </div>

        <div className="w-full">
          <Menu />
        </div>
      </div>
    </header>
  );
}
