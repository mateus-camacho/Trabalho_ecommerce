import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/authContext";


export default function Avatar() {
    const { user, isAuthenticated } = useAuth();

    return (
        <Popover>
            <PopoverTrigger>
                <div className="h-7 w-7 transition-colors duration-300 hover:text-gray-300 flex items-center justify-center">
                    <CircleUserRound size={20} />
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="w-32 flex flex-col gap-1">
                    {
                        user && isAuthenticated() ? (
                            <>
                                <Link to={'/settings'}>
                                    <Button variant={'ghost'} className="w-full">
                                        Configurações
                                    </Button>
                                </Link>
                                <Link to={'/orders'}>
                                    <Button variant={'ghost'} className="w-full">
                                        Pedidos
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <Link to={'/login'}>
                                <Button variant={'ghost'} className="w-full">
                                    Login
                                </Button>
                            </Link>
                        )
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}