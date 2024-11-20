import { Menu, CircleUserRound } from "lucide-react";
import Search from "./search";
import Cart from "./cart";

export default function Header() {
  const handleOpenUser = () => {
    console.log("opening user...");
  };

  const handleOpenMenu = () => {
    console.log("opening menu...");
  };

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
            <Cart />
            <button
              className="h-7 w-7 transition-colors duration-300 hover:text-gray-300 flex items-center justify-center"
              onClick={handleOpenUser}
            >
              <CircleUserRound size={20} />
            </button>
          </div>
        </div>

        <div className="w-full">
          <button
            className="h-9 px-2 flex items-center gap-2 text-white text-sm transition-colors duration-300 hover:text-gray-300"
            onClick={handleOpenMenu}
          >
            <Menu size={20} />
            <span>menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
