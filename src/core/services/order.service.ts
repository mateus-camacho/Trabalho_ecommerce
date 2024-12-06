import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/cartContext";

export function OrderService() {
  const api = useApi();
  const { toast } = useToast();

  const { isAuthenticated, token, tokenIsExpired } = useAuth();
  const { setLoading } = useCart();
  const navigate = useNavigate();

  const checkUser = () => {
    if (!isAuthenticated() || tokenIsExpired()) {
      toast({
        duration: 2000,
        variant: "destructive",
        title: "Erro ao realizar pedido",
        description: "Você precisa estar logado para realizar um pedido.",
      });

      navigate("/login");
    }
  };

  const checkout = async (data: any): Promise<void> => {
    setLoading(true);

    const response = await api
      .post("/checkout", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast({
          duration: 2000,
          title: "Pedido realizado com sucesso!",
          description: "Seu pedido foi realizado com sucesso.",
        });

        setLoading(false);
        return response;
      })
      .catch((error) => {
        const code = error.status;

        setLoading(false);

        if (code === 401) {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar pedido",
            description: "Você precisa estar logado para realizar um pedido.",
          });

          navigate("/login");
        } else if (code === 404) {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar pedido",
            description:
              "Seu carrinho está vazio, adicione itens para continuar.",
          });
        } else if (code === 400) {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar pedido",
            description: "O estoque de um dos produtos não é suficiente.",
          });
        } else {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar pedido",
            description:
              "Ocorreu um erro ao realizar seu pedido, tente novamente.",
          });
        }

        return error;
      });

    return response.data;
  };

  const getByUser = async (): Promise<void> => {
    checkUser();

    const response = await api
      .get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Erro ao buscar pedidos",
          description:
            "Ocorreu um erro ao buscar seus pedidos, tente novamente.",
        });

        return error;
      });

    return response.data;
  };

  const getById = async (id: string): Promise<void> => {
    checkUser();

    const response = await api
      .get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast({
          duration: 2000,
          variant: "destructive",
          title: "Erro ao buscar pedido",
          description: "Ocorreu um erro ao buscar seu pedido, tente novamente.",
        });

        return error;
      });

    return response.data;
  };

  return {
    checkout,
    getByUser,
    getById,
  };
}
