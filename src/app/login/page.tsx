// import { LoginForm } from "@/components/login-form"
// import { createServerClient } from "@/lib/supabase-server"
// import { redirect } from "next/navigation"
import LoginForm from "@/components/login-form/page"
import { authOptions } from "@/lib/auth";
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center justify-center">
            {/* <Wallet className="h-8 w-8 text-green-600" /> */}
            <span className="ml-2 text-2xl font-bold">FinWallet</span>
          </Link>
          <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Entre com seu email e senha para acessar sua carteira
          </p>
        </div>
        <LoginForm />
        <div className="text-center text-sm">
          <p>
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-green-600 hover:text-green-500">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
