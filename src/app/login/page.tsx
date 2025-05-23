// import { LoginForm } from "@/components/login-form"
// import { createServerClient } from "@/lib/supabase-server"
// import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form/page"
import { authOptions } from "@/lib/auth";
import { Wallet } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link"
import { redirect } from "next/navigation";
// import { Wallet } from "lucide-react"

export default async function LoginPage() {
 const session = await getServerSession(authOptions);


    if(session && session.user) {
        redirect("/dashboard")
    }

  return (
    // <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
    //   <div className="w-full max-w-md space-y-8">
    //     <div className="flex flex-col items-center space-y-2 text-center">
    //       <Link href="/" className="flex items-center justify-center">
    //         {/* <Wallet className="h-8 w-8 text-green-600" /> */}
    //         <span className="ml-2 text-2xl font-bold">FinWallet</span>
    //       </Link>
    //       <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
    //       <p className="text-sm text-gray-500 dark:text-gray-400">
    //         Entre com seu email e senha para acessar sua carteira
    //       </p>
    //     </div>
    //     <LoginForm />
    //     <div className="text-center text-sm">
    //       <p>
    //         Não tem uma conta?{" "}
    //         <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
    //           Cadastre-se
    //         </Link>
    //       </p>
    //     </div>
    //   </div>
    // </div>

       <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-2xl"> {/* Card mais elegante */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <Link href="/" className="flex items-center justify-center mb-4"> {/* Adicionei margem inferior */}
            <Wallet className="h-10 w-10 text-green-600" /> {/* Ícone maior e visível */}
            <span className="ml-3 text-3xl font-extrabold text-gray-900">FinWallet</span> {/* Texto maior e mais forte */}
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Acesse sua Conta
          </h1> {/* Título mais impactante */}
          <p className="text-base text-gray-600">
            Entre com seu e-mail e senha para gerenciar suas finanças.
          </p> {/* Descrição mais convidativa */}
        </div>
        <LoginForm />
        <div className="text-center text-sm mt-6"> {/* Margem superior para separar */}
          <p className="text-gray-600">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-700 hover:text-green-800 transition-colors duration-200" // Cor mais escura no hover
            >
              Cadastre-se aqui!
            </Link> {/* Chamada para ação mais clara */}
          </p>
        </div>
      </div>
    </div>
  )
}
