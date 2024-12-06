import { useAuth } from "@/contexts/authContext";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function UserService() {
  const api = useApi();
  const { toast } = useToast();

  const { createSession } = useAuth();
  const navigate = useNavigate();

  const register = async (data: any): Promise<void> => {
    const response = await api
      .post("/register", data)
      .then((response) => {
        toast({
          duration: 2000,
          title: "Conta criada com sucesso!",
          description:
            "Sua conta foi criada com sucesso, agora você já pode acessar o sistema.",
        });

        const { token } = response.data;
        createSession(token);

        navigate("/");
        return response;
      })
      .catch((error) => {
        const code = error.status;

        if (code === 409) {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao criar conta",
            description: "Já existe uma conta com esse e-mail.",
          });
        } else {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao criar conta",
            description: "Ocorreu um erro ao criar sua conta, tente novamente.",
          });
        }

        return error;
      });

    return response.data;
  };

  const login = async (data: any): Promise<void> => {
    const response = await api
      .post("/login", data)
      .then((response) => {
        toast({
          duration: 2000,
          title: "Login realizado com sucesso!",
          description: "Você foi autenticado com sucesso no sistema.",
        });

        const { token } = response.data;
        createSession(token);

        navigate("/");
        return response;
      })
      .catch((error) => {
        const code = error.status;

        if (code === 401) {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar login",
            description: "E-mail ou senha incorretos.",
          });
        } else {
          toast({
            duration: 2000,
            variant: "destructive",
            title: "Erro ao realizar login",
            description:
              "Ocorreu um erro ao realizar o login, tente novamente.",
          });
        }

        return error;
      });

    return response.data;
  };

  return {
    register,
    login,
  };
}
