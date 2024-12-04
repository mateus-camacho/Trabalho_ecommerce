import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"


import { Calendar1Icon, EyeClosedIcon, EyeIcon } from "lucide-react";


const registerSchema = z.object({
    name: z.string()
        .nonempty('Nome é obrigatório!')
        .min(2, 'Mínimo de 2 caracteres!')
        .max(50, 'Máximo de 50 caracteres!'),
    email: z.string()
        .nonempty('Email é obrigatório!')
        .email('Email inválido!'),
    password: z.string()
        .nonempty('Senha é obrigatória!')
        .min(8, 'Mínimo de 8 caracteres!')
        .max(20, 'Máximo de 20 caracteres!'),
    birthDate: z.date({
        message: 'Data inválida!'
    }),
});

export default function Register() {
    const [showPass, setShowPass] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const registerForm = useForm({
        resolver: zodResolver(registerSchema),
    });

    const { handleSubmit, reset } = registerForm;

    const handleRegister = async (data: any) => {
        try {
            const response = await axios.post("http://localhost:3000/register", data);
            console.log("Registro bem-sucedido:", response.data);
            setErrorMessage("Cadastro realizado com sucesso");
            reset();
            
        } catch (error: any) {
            console.error("Erro no registro:", error);
            setErrorMessage(error.response?.data?.message || "Erro inesperado!");
        }
    };

    return (
        <Form {...registerForm}>
            <form
                onSubmit={handleSubmit(handleRegister)}
                className="flex flex-col gap-2 mt-2 w-full max-w-sm mx-auto"
            >
                <FormField
                    control={registerForm.control}
                    name="name"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="nome" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={registerForm.control}
                    name="email"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="email" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={registerForm.control}
                    name="password"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <div className="w-full relative">
                                    <Input
                                        placeholder="senha"
                                        type={
                                            showPass ? 'text' : 'password'
                                        }
                                        className="pr-8"
                                        {...field} />

                                    <Button
                                        type="button"
                                        className="absolute right-0 top-0"
                                        variant={'link'}
                                        onClick={() => {
                                            setShowPass(!showPass)
                                        }}
                                    >
                                        {
                                            !showPass ? (
                                                <EyeIcon width={'20'} />
                                            ) : (
                                                <EyeClosedIcon width={'20'} />
                                            )
                                        }
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={registerForm.control}
                    name="birthDate"
                    defaultValue=""
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                            <FormLabel>Data de nascimento</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "dd/MM/yyyy")
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                            <Calendar1Icon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="mt-4 mx-auto w-full max-w-80" type="submit">
                    criar minha conta
                </Button>
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>)
                }
            </form>
        </Form>
    )
}