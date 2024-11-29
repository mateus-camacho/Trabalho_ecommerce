import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import Login from "./login"
import Register from './register'

export default function Index() {
    const [page, setPage] = useState<'login' | 'register'>('login')

    const handleChangePage = () => {
        setPage(
            page === 'login' ? 'register' : 'login'
        )
    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-xl bg-white rounded-sm shadow-sm border border-slate-100 px-10 py-8 flex flex-col gap-1 relative">
                <div className="absolute top-4 left-4">
                    <Link to={'/'}>
                        <Button variant={'link'}>
                            <ArrowLeft width={'20'}></ArrowLeft>

                            <span>
                                voltar a loja
                            </span>
                        </Button>
                    </Link>
                </div>

                <div className="text-center mt-8 mb-6">
                    <h1 className="text-gray-600 text-2xl font-bold uppercase">
                        {
                            page === 'login' ? 'Login' : 'Register'
                        }
                    </h1>
                    <p className="text-gray-600 font-light">
                        {
                            page === 'login' ?
                                'Utilize seu login e senha para entrar em sua conta!' :
                                'Utilize o formulário abaixo para criar uma nova conta!'
                        }
                    </p>
                </div>

                {
                    page === 'login' ?
                        (
                            <Login></Login>
                        ) :
                        (
                            <Register></Register>
                        )
                }

                <button
                    className="ml-auto mt-2 text-gray-500 font-bold text-sm transition-colors duration-300 hover:text-blue-500"
                    onClick={handleChangePage}>
                    {
                        page === 'login' ?
                            'Não possui uma conta?' :
                            'Já possui uma conta?'
                    }
                </button>
            </div>
        </div>
    )
}