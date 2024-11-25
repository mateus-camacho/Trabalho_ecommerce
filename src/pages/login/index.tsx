import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Index() {
    const [page, setPage] = useState<'login' | 'register'>('login')

    return (
        <div className="w-full min-h-screen bg-blue-500 relative flex-1">
            <Link to={'/'} className="absolute top-4 left-4">
                <Button variant={'link'} className="text-white transition-colors duration-300 hover:text-gray-100">
                    <ArrowLeft width={'20'}></ArrowLeft>
                </Button>
            </Link>

            <aside className="w-full max-w-3xl min-h-screen bg-white ml-auto flex items-center justify-center shadow-sm">
                <p>a</p>
            </aside>
        </div>
    )
}