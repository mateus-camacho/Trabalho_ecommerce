import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { UserService } from "../../core/services/user.service";

const loginSchema = z.object({
  email: z.string().nonempty("Email é obrigatório!").email("Email inválido!"),
  password: z.string().nonempty("Senha é obrigatória!"),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);

  const userService = UserService();
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const { handleSubmit, reset } = loginForm;

  const handleLogin = async (data: any) => {
    const response = await userService.login(data);
    console.log("Login bem-sucedido:", response);

    reset();
  };

  return (
    <Form {...loginForm}>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="flex flex-col gap-2 mt-2 w-full max-w-sm mx-auto"
      >
        <FormField
          control={loginForm.control}
          name="email"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="email"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={loginForm.control}
          name="password"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <div className="w-full relative">
                  <Input
                    autoComplete="current-password"
                    placeholder="senha"
                    type={showPass ? "text" : "password"}
                    className="pr-8"
                    {...field}
                  />

                  <Button
                    type="button"
                    className="absolute right-0 top-0"
                    variant={"link"}
                    onClick={() => {
                      setShowPass(!showPass);
                    }}
                  >
                    {!showPass ? (
                      <EyeIcon width={"20"} />
                    ) : (
                      <EyeClosedIcon width={"20"} />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="mt-4 mx-auto w-full max-w-80" type="submit">
          entrar
        </Button>
      </form>
    </Form>
  );
}
