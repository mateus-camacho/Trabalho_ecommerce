import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/authContext";
import { Separator } from "../ui/separator";

export default function Avatar() {
  const { user, isAuthenticated, destroySession } = useAuth();

  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-7 w-7 transition-colors duration-300 hover:text-gray-300 flex items-center justify-center">
          <CircleUserRound size={20} />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="w-48 flex flex-col gap-1">
          {user && isAuthenticated() ? (
            <>
              <span className="text-sm text-gray-600 font-semibold text-center">
                Olá, {user.name}
              </span>

              <Separator className="my-2" />

              <Link to={"/settings"}>
                <Button variant={"ghost"} className="w-full">
                  Configurações
                </Button>
              </Link>
              <Link to={"/orders"}>
                <Button variant={"ghost"} className="w-full">
                  Pedidos
                </Button>
              </Link>
              <Button
                variant={"ghost"}
                className="w-full"
                onClick={destroySession}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link to={"/login"}>
              <Button variant={"ghost"} className="w-full">
                Login
              </Button>
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
